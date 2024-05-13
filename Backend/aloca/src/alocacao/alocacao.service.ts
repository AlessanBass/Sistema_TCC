import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlocacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAlocacaoDto: CreateAlocacaoDto) {
    try {
      return this.prisma.alocacao.create({
        data: {
          observacoes_colegiado: createAlocacaoDto.observacoes_colegiado,
          disciplina_id_disciplina: (+createAlocacaoDto.disciplina_id_disciplina),
          professor_id_professor: (+createAlocacaoDto.professor_id_professor),
          semestre_id_semestre: (+createAlocacaoDto.semestre_id_semestre)
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao cadastrar nova alocação");
    }
  }

  async findAll() {
    try {
      return this.prisma.alocacao.findMany({
        include: {
          disciplina: true, // Inclui todas as informações da disciplina relacionada
          professor: true, // Inclui todas as informações do professor relacionado
          semestre: true, // Inclui todas as informações do semestre relacionado
        },
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar as alocações");
    }
  }

  async findOne(id: number) {
    /* Tem que terminar de implementar, trazer retorno caso algo ocorra  */
    return this.prisma.$queryRaw`
     SELECT 
     alocacao.*,
     disciplina.*,
     professor.*,
     semestre.*
     FROM alocacao
     INNER JOIN disciplina ON alocacao.disciplina_id_disciplina = disciplina.id_disciplina
     INNER JOIN professor ON alocacao.professor_id_professor = professor.id_professor
     INNER JOIN semestre ON alocacao.semestre_id_semestre = semestre.id_semestre
     WHERE alocacao.id_alocacao = ${id}
     `;
  }

  async update(id: number, updateAlocacaoDto: UpdateAlocacaoDto) {
    try {
      let query = `UPDATE alocacao SET `;
      let valores: any[] = [];

      if (updateAlocacaoDto.observacoes_colegiado != undefined) {
        query += `observacoes_colegiado = ? , `;
        valores.push(updateAlocacaoDto.observacoes_colegiado);
      }

      if (updateAlocacaoDto.disciplina_id_disciplina != undefined) {
        query += `disciplina_id_disciplina = ? , `;
        valores.push(+updateAlocacaoDto.disciplina_id_disciplina);
      }

      if (updateAlocacaoDto.professor_id_professor != undefined) {
        query += `professor_id_professor = ? , `;
        valores.push(+updateAlocacaoDto.professor_id_professor);
      }

      if (updateAlocacaoDto.semestre_id_semestre != undefined) {
        query += `semestre_id_semestre = ? , `;
        valores.push(+updateAlocacaoDto.semestre_id_semestre);
      }

      /* Remove a última vírgula da query */
      query = query.slice(0, -2);

      /* Adiciona a condição */
      query += ` WHERE id_alocacao = ? `;

      /* Adiciona a vírgula no final */
      query += `;`;

      valores.push(id);
      return this.prisma.$queryRawUnsafe(query, ...valores);

    } catch (e) {
      throw new InternalServerErrorException("Erro ao atualizar alocação");
    }
  }


  async remove(id: number) {
    try {
      const alocacao = await this.findOne(id);
      console.log(alocacao);

      /* if (!alocacao) { implemnetra depois
        throw new BadRequestException("Não existe essa alocação");
      } */

      return this.prisma.$queryRaw`DELETE FROM alocacao WHERE id_alocacao = ${id}`;

    } catch (error) {
      throw new BadRequestException("Não existe essa alocação");
    }

  }
}
