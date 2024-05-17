import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TurmaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTurmaDto: CreateTurmaDto) {
    const existingTurma = await this.prisma.turma.findFirst({ where: { nome_turma: createTurmaDto.nome_turma } });
    if (existingTurma) {
      throw new ConflictException('Já existe uma Turma com esse nome');
    }

    /* Cria a nova turma */
    try {
      return this.prisma.turma.create({
        data: {
          nome_turma: createTurmaDto.nome_turma,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar nova turma');
    }
  }

  async findAll() {
    try {
      return this.prisma.turma.findMany();
    } catch (error) {
      throw new BadRequestException("Erro ao solicitar turmas");
    }
  }

  async findOne(id: number) {
    try {
      return this.prisma.turma.findFirst({
        where: {
          id_turma: id
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar a turma");
    }
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    /* Verifica se a turma existe */
    const turma = await this.prisma.turma.findUnique({ where: { id_turma: id } });
    if (!turma) {
      throw new NotFoundException("Turma não encontrada");
    }

    /* Verifica se já existe uma turma com o novo nome */
    const existingTurma = await this.prisma.turma.findFirst({ where: { nome_turma: updateTurmaDto.nome_turma } });
    if (existingTurma && existingTurma.id_turma !== id) {
      throw new ConflictException("Já existe uma Turma com esse nome");
    }

    /* Atualiza a turma */
    try {
      return this.prisma.turma.update({
        data: {
          nome_turma: updateTurmaDto.nome_turma,
        },
        where: { id_turma: id }
      });
    } catch (e) {
      throw new InternalServerErrorException("Erro ao atualizar turma");
    }
  }

  async remove(id: number) {
    /* Verifica se a turma existe */
    const turma = await this.prisma.turma.findUnique({
      where: { id_turma: id },
      include: { disciplina: true } // inclui os professores relacionados
    });

    if (!turma) {
      throw new NotFoundException("Turma não encontrada");
    }

    // Deleta todos os professores associados à área
    for (const disciplina of turma.disciplina) {
      await this.prisma.disciplina.delete({
        where: { id_disciplina: disciplina.id_disciplina }
      });
    }

    // Agora que todos os professores foram deletados, a área pode ser deletada
    try {
      return this.prisma.turma.delete({
        where: { id_turma: id }
      });
    } catch (e) {
      throw new NotFoundException("Erro ao deletar turma");
    }
  }
}
