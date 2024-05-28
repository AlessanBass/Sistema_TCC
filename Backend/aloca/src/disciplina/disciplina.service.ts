import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAlocacaoDto } from 'src/alocacao/dto/update-alocacao.dto';

@Injectable()
export class DisciplinaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDisciplinaDto: CreateDisciplinaDto) {
    // Verifica se já existe uma disciplina para o curso especificado
    const existingDisciplinaForCurso = await this.prisma.disciplina.findFirst({
      where: {
        curso_id_curso: (+createDisciplinaDto.curso_id_curso),
        nome_disciplina: createDisciplinaDto.nome_disciplina,
        cod: createDisciplinaDto.cod
      }
    });

    if (existingDisciplinaForCurso) {
      throw new ConflictException(`Já existe uma disciplina com esse nome ${createDisciplinaDto.nome_disciplina} para o curso especificado`);
    }


    /* Cria a nova disciplina */
    try {
      return this.prisma.disciplina.create({
        data: {
          periodo: (+createDisciplinaDto.periodo),
          cod: createDisciplinaDto.cod.trim().toLocaleUpperCase(),
          nome_disciplina: createDisciplinaDto.nome_disciplina.trim().toLocaleUpperCase(),
          carga_horaria: (+createDisciplinaDto.carga_horaria),
          qtd_creditos: (+createDisciplinaDto.qtd_creditos),
          curso_id_curso: (+createDisciplinaDto.curso_id_curso),
          area_id_area: (+createDisciplinaDto.area_id_area),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar nova disciplina');
    }
  }

  async findAll() {
    try {
      return this.prisma.disciplina.findMany();/* Voltar ao normal depois */
    } catch (e) {
      throw new BadRequestException("Erro ao buscar as disciplinas");
    }
  }

  async findDisciplinaByCurso(id_curso: number, skip: number, take: number) {
    try {
      const [total, disciplinas] = await this.prisma.$transaction([
        this.prisma.disciplina.count({
          where: {
            curso_id_curso: id_curso
          }
        }),
        this.prisma.disciplina.findMany({
          where: {
            curso_id_curso: id_curso
          },
          orderBy: {
            nome_disciplina: 'asc'
          },
          skip: skip,
          take: take
        })
      ]);

      return { total, disciplinas };
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Erro ao buscar as disciplinas por curso");
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

    
    
    /* Verifica se já existe uma disciplina com o novo código */
      const existingDisciplina = await this.prisma.disciplina.findFirst({
        where: {
          cod: updateDisciplinaDto.cod,
          nome_disciplina: updateDisciplinaDto.nome_disciplina,
          curso_id_curso: (+updateDisciplinaDto.curso_id_curso),
          NOT:{
            id_disciplina:id
          }
        },
      });

      console.log(existingDisciplina);
      if (existingDisciplina) {
        throw new ConflictException("Já existe uma disciplina com esse código e nome em outro curso!");
      }

    /* Atualiza a disciplina */
    try {
      const dataToUpdate: any = {};

      // Verifica e adiciona os campos presentes na requisição
      if (updateDisciplinaDto.periodo !== undefined) {
        dataToUpdate.periodo = +updateDisciplinaDto.periodo;
      }
      if (updateDisciplinaDto.cod !== undefined) {
        dataToUpdate.cod = updateDisciplinaDto.cod.trim().toUpperCase();
      }
      if (updateDisciplinaDto.nome_disciplina !== undefined) {
        dataToUpdate.nome_disciplina = updateDisciplinaDto.nome_disciplina.trim().toUpperCase();
      }
      if (updateDisciplinaDto.carga_horaria !== undefined) {
        dataToUpdate.carga_horaria = +updateDisciplinaDto.carga_horaria;
      }
      if (updateDisciplinaDto.qtd_creditos !== undefined) {
        dataToUpdate.qtd_creditos = +updateDisciplinaDto.qtd_creditos;
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
    // Verifica se a disciplina existe
    const disciplina = await this.findOne(id);

    try {
      // Executa a transação para deletar da oferta, alocação e depois da disciplina
      await this.prisma.$transaction(async (prisma) => {
        
        // Remove todas as alocações relacionadas às ofertas dessa disciplina
        await prisma.alocacao.deleteMany({
          where: { 
            oferta:{
              disciplina_id_disciplina:id
            }
          },
        });

        // Remove todas as ofertas relacionadas à disciplina
        await prisma.oferta.deleteMany({
          where:{
            disciplina_id_disciplina:id
          }
        });

      // Remove a disciplina
      await prisma.disciplina.delete({
        where: { id_disciplina: id },
      });
    });
  } catch(error) {
    console.log(error);
    throw new NotFoundException('Erro ao deletar disciplina');
  }
}

 async findOneCodAndCurso(cod: string, nome_disciplina: string, id_curso: number){
  try {
    let retorno = this.prisma.disciplina.findFirst({
      where: {
        cod: cod,
        nome_disciplina: nome_disciplina,
        curso_id_curso: id_curso
      }
    });
    return retorno;

  } catch (error) {
    throw new BadRequestException("Erro ao buscar por disciplina");
  }
}

  async findOneCod(cod: string) {
  /* Se não encontrar o retorno é NULL */
  /* Posso passar um parametro opcional como por exemplo a turma */
  try {
    return this.prisma.disciplina.findFirst({
      where: {
        cod: cod
      }
    });

  } catch (error) {
    throw new BadRequestException("Erro ao buscar por disciplina");
  }
}
}
