import { BadRequestException, Catch, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAreaDto: CreateAreaDto) {
    const verificaNome = await this.findByNome(createAreaDto.nomeArea);
    if (verificaNome.length > 0) {
      throw new BadRequestException("Já existe área com esse nome!");
    }

    try {
      /* Falta verificar se já existe um curso com esse nome */

      return this.prisma.area.create({
        data: {
          nome_area: createAreaDto.nomeArea,
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao cadastrar nova área");
    }
  }

  async findAll() {
    try {
      return this.prisma.area.findMany({
        orderBy: {
          nome_area: 'asc'
        }
      });
    } catch (error) {
      throw new BadRequestException("Erro ao solicitar areas");
    }
  }

  async findOne(id: number) {
    try {
      return this.prisma.area.findFirst({
        where: {
          id_area: id
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar a área");
    }
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    /* Verifica se a área existe */
    const area = await this.prisma.area.findUnique({ where: { id_area: id } });
    if (!area) {
      throw new NotFoundException("Área não encontrada");
    }
  
    /* Verifica se já existe uma área com o novo nome */
    const existingArea = await this.prisma.area.findFirst({ where: { nome_area: updateAreaDto.nomeArea } });
    if (existingArea && existingArea.id_area !== id) {
      throw new ConflictException("Já existe uma área com esse nome");
    }
  
    /* Atualiza a área */
    try {
      return this.prisma.area.update({
        data: {
          nome_area: updateAreaDto.nomeArea,
        },
        where: { id_area: id }
      });
    } catch (e) {
      throw new InternalServerErrorException("Erro ao atualizar área");
    }
  }
  
  async remove(id: number) {
    /* Verifica se a área existe */
    const area = await this.prisma.area.findUnique({
      where: { id_area: id },
      include: { professor: true } // inclui os professores relacionados
    });

    if (!area) {
      throw new NotFoundException("Área não encontrada");
    }

    // Deleta todos os professores associados à área
    for (const professor of area.professor) {
      await this.prisma.professor.delete({
        where: { id_professor: professor.id_professor }
      });
    }

    // Agora que todos os professores foram deletados, a área pode ser deletada
    try {
      return this.prisma.area.delete({
        where: { id_area: id }
      });
    } catch (e) {
      throw new NotFoundException("Erro ao deletar área");
    }
  }

  async findByNome(nome: string) {
    try {
      const semestre = await this.prisma.area.findMany({
        where: {
          nome_area: nome,
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
}
