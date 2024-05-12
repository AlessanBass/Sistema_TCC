import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DisciplinaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDisciplinaDto: CreateDisciplinaDto) {
    try {
      return this.prisma.disciplina.create({
        data: {
          periodo : (+createDisciplinaDto.periodo),
          cod : createDisciplinaDto.cod,
          nome_disciplina : createDisciplinaDto.nome_disciplina,
          carga_horaria : (+createDisciplinaDto.carga_horaria),
          qtd_creditos : (+createDisciplinaDto.qtd_creditos),
          turma : createDisciplinaDto.turma,
          curso_id_curso :(+createDisciplinaDto.curso_id_curso),
          area_id_area : (+createDisciplinaDto.area_id_area)
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao cadastrar nova disciplina");
    }
  }

  async findAll() {
    try {
      return this.prisma.disciplina.findMany({
        orderBy:{
          nome_disciplina: 'asc'
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar as disciplinas");
    }
  }

  async findOne(id: number) {
    try {
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id_disciplina: id }
      });

      if (!disciplina) {
        throw new NotFoundException(`Disciplina com id ${id} não encontrado`);
      }

      return disciplina;

    } catch (e) {
      throw new BadRequestException("Erro ao buscar a disciplina");
    }
  }

  async update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
    /* Atualiza a área */
    try {
      const dataToUpdate: any = {};
  
      // Verifica e adiciona os campos presentes na requisição
      if (updateDisciplinaDto.periodo !== undefined) {
        dataToUpdate.periodo = +updateDisciplinaDto.periodo;
      }
      if (updateDisciplinaDto.cod !== undefined) {
        dataToUpdate.cod = updateDisciplinaDto.cod;
      }
      if (updateDisciplinaDto.nome_disciplina !== undefined) {
        dataToUpdate.nome_disciplina = updateDisciplinaDto.nome_disciplina;
      }
      if (updateDisciplinaDto.carga_horaria !== undefined) {
        dataToUpdate.carga_horaria = +updateDisciplinaDto.carga_horaria;
      }
      if (updateDisciplinaDto.qtd_creditos !== undefined) {
        dataToUpdate.qtd_creditos = +updateDisciplinaDto.qtd_creditos;
      }
      if (updateDisciplinaDto.turma !== undefined) {
        dataToUpdate.turma = updateDisciplinaDto.turma;
      }
      if (updateDisciplinaDto.curso_id_curso !== undefined) {
        dataToUpdate.curso_id_curso = +updateDisciplinaDto.curso_id_curso;
      }
      if (updateDisciplinaDto.area_id_area !== undefined) {
        dataToUpdate.area_id_area = +updateDisciplinaDto.area_id_area;
      }
  
      return this.prisma.disciplina.update({
        data: dataToUpdate,
        where: { 
          id_disciplina: id,
        }
      });
    } catch (e) {
      throw new InternalServerErrorException("Erro ao atualizar área");
    }
  }
  
  async remove(id: number) {
    /* Verifica se o curso existe */
    const disciplina = await this.findOne(id);

    try {
      return this.prisma.disciplina.delete({
        where:{id_disciplina:id}
      });
    } catch (e) {
      throw new NotFoundException("Erro ao deletar disciplina");
    }
  }

  async findOneCod(cod: string){
    /* Se não encontrar o retorno é NULL */
    /* Posso passar um parametro opcional como por exemplo a turma */
    try {
      return this.prisma.disciplina.findFirst({
        where:{
          cod:cod
        }
      });
      
    } catch (error) {
      throw new BadRequestException("Erro ao buscar por disciplina");
    }
  }
}
