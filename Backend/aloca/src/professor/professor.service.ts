import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProfessorDto: CreateProfessorDto) {
    const id_area = parseInt(createProfessorDto.area_id_area);
    try {
      return this.prisma.professor.create({
        data: {
          nome_professor: createProfessorDto.nomeProfessor,
          observacoes: createProfessorDto.observacoes,
          area_id_area: id_area
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao inserir")
    }
  }

  async findByArea(area: string) {
    const areaInt = parseInt(area);
    try {
      return this.prisma.professor.findMany({
        include: {
          area: true,
          alocacao: {
            include: {
              disciplina: true
            }
          }
        },
        where: {
          area_id_area: areaInt
        },
        orderBy: {
          nome_professor: 'asc' // Ordenar pelo nome do professor em ordem alfabética ascendente
        }
      });

    } catch (e) {
      throw new BadRequestException("Erro ao buscar os professores");
    }
  }
  /* Fazer a páginação e colocar os atributos do WHERE */
  async findAll() {
    try {
      return this.prisma.professor.findMany({
        include: {
          area: true,
          alocacao: {
            include: {
              disciplina: true
            }
          }
        },

      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar os professores");
    }
  }

  async findOne(id: number) {
    if (await this.empity(id)) {
      throw new BadRequestException(`Erro ao procurar o professor com o ID ${id}}`);
    }

    try {
      return this.prisma.professor.findUnique({
        include: {
          area: true,
          alocacao: {
            include: {
              disciplina: true
            }
          }
        },
        where: { id_professor: id }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar os professores")
    }
  }

  async update(id: number, updateProfessorDto: UpdateProfessorDto) {
    const id_area = parseInt(updateProfessorDto.area_id_area);

    if (await this.empity(id)) {
      throw new BadRequestException(`Erro ao atualizar o professor com o ID ${id}}`);
    }

    try {
      return this.prisma.professor.update({
        data: {
          nome_professor: updateProfessorDto.nomeProfessor,
          observacoes: updateProfessorDto.observacoes,
          area_id_area: id_area
        },
        where: {
          id_professor: id
        }
      });
    } catch (e) {
      throw new BadRequestException(`Erro ao atualizar o professor com o ID ${id}: ${e.message}`);
    }

  }

  async remove(id: number) {
    /* Verifica se o professor tá na tabela de alocação */
    if (await this.emptyAlocacao(id)) {
      // faço nada
    } else {
      try {
        await this.prisma.alocacao.deleteMany({
          where: {
            professor_id_professor: id
          }
        });
      } catch (error) {
        throw new BadRequestException(`Erro ao deleter o professor com o ID ${id}: ${error.message}`);
      }
    }

    /* veriica se o professor existe */
    if (await this.empity(id)) {
      throw new BadRequestException(`Erro ao deleter o professor com o ID ${id}`);
    } else {
      return this.prisma.professor.delete({
        where: {
          id_professor: id
        }
      })
    }
  }

  async empity(id: number) {
    const professor = await this.prisma.professor.findUnique({
      where: {
        id_professor: id
      }
    });
    //console.log(professor);

    if (professor === null || professor === undefined) {
      return true;
    } else {
      return false;
    }
  }

  async emptyAlocacao(id: number) {
    const alocacao = await this.prisma.alocacao.findFirst({
      where: {
        professor_id_professor: id
      }
    });
    //console.log(alocacao);

    if (alocacao === null || alocacao === undefined) {
      return true;
    } else {
      return false;
    }
  }


}
