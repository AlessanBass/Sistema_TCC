import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SemestreService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createSemestreDto: CreateSemestreDto) {
    const existingSemestre = await this.prisma.semestre.findFirst({ where: { nome_semestre: createSemestreDto.nomeSemestre } });
    if (existingSemestre) {
      throw new ConflictException('Já existe um semestre com esse nome');
    }

    /* Cria a nova turma */
    try {
      return this.prisma.semestre.create({
        data: {
          nome_semestre: createSemestreDto.nomeSemestre,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar um novo');
    }
  }

  async findAll() {
    try {
      return this.prisma.semestre.findMany({
        orderBy: {
          nome_semestre: 'asc'
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar os semestres");
    }
  }

  async findOne(id: number) {
    try {
      const semestre = await this.prisma.semestre.findUnique({
        where: { id_semestre: id }
      });

      if (!semestre) {
        throw new NotFoundException(`Semestre com id ${id} não encontrado`);
      }

      return semestre;

    } catch (e) {
      throw new BadRequestException("Erro ao buscar o semestre");
    }
  }

  async update(id: number, updateSemestreDto: UpdateSemestreDto) {
    /* Verifica se a turma existe */
    const semestre = await this.prisma.semestre.findUnique({ where: { id_semestre: id } });
    if (!semestre) {
      throw new NotFoundException("Semestre não encontrada");
    }

    /* Verifica se já existe uma turma com o novo nome */
    const existingSemestre = await this.prisma.semestre.findFirst({ where: { nome_semestre: updateSemestreDto.nomeSemestre } });
    if (existingSemestre && existingSemestre.id_semestre !== id) {
      throw new ConflictException("Já existe um semestre com esse nome");
    }

    /* Atualiza a turma */
    try {
      return this.prisma.semestre.update({
        data: {
          nome_semestre: updateSemestreDto.nomeSemestre,
        },
        where: { id_semestre: id }
      });
    } catch (e) {
      throw new InternalServerErrorException("Erro ao atualizar semestre");
    }
  }

  async remove(id: number) {
    /* Verifica se o curso existe */
    const semestre = await this.findOne(id);

    try {
      return this.prisma.semestre.delete({
        where: { id_semestre: id }
      });
    } catch (e) {
      throw new NotFoundException("Erro ao deletar semestre");
    }
  }

  async findByNome(nome: string) {
    try {
      const semestre = await this.prisma.semestre.findMany({
        where: {
          nome_semestre: nome,
        },
      });

      /* Posso retornar um array vazio para indicar que não existe esse curso ainda */

      /*  if(curso.length === 0){
         throw new NotFoundException("Não existe curso com essse nome");
       } */

      return semestre;

    } catch (e) {
      throw new NotFoundException("Erro ao buscar curso por esse nome");
    }

  }

  async findLatest() {
    try {
      const latestSemestre = await this.prisma.semestre.findFirst({
        orderBy: {
          id_semestre: 'desc',
        },
      });

      if (!latestSemestre) {
        throw new NotFoundException('Nenhum semestre encontrado');
      }

      return latestSemestre;
    } catch (e) {
      throw new InternalServerErrorException('Erro ao buscar o semestre mais recente');
    }
  }
}
