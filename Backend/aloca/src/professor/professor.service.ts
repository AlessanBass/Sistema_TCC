import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProfessorDto: CreateProfessorDto) {
    const existingProfessor = await this.prisma.professor.findFirst({ 
      where: { 
        nome_professor: createProfessorDto.nomeProfessor,
        area_id_area: (+createProfessorDto.area_id_area)
      } 
    });
    if (existingProfessor) {
     /*  throw new ConflictException('Já existe um professor com esse nome'); */
     return null;
    }

    /* Cria um novo professor */
    try {
      return this.prisma.professor.create({
        data: {
          nome_professor: createProfessorDto.nomeProfessor.toUpperCase(),
          observacoes: createProfessorDto.observacoes,
          area_id_area: (+createProfessorDto.area_id_area)
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar professor');
    }
  }

  async findByArea(area: string) {
    const areaInt = parseInt(area);
    try {
      return this.prisma.professor.findMany({
        include: {
          area: true,
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
          area:true,
          alocacao:{
            include:{
              oferta:{
                include:{
                  disciplina:true
                }
              }
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
     /* Verifica se a professor existe */
     const professor = await this.prisma.professor.findUnique({ where: { id_professor: id } });
     if (!professor) {
       throw new NotFoundException("Professor não encontrada");
     }
 
     /* Verifica se já existe um professor com o novo nome */
     const existingProfessor = await this.prisma.professor.findFirst({ where: { nome_professor: updateProfessorDto.nomeProfessor } });
     if (existingProfessor && existingProfessor.id_professor !== id) {
       throw new ConflictException("Já existe um professor com esse nome");
     }
 
     /* Atualiza o professor */
     try {
       return this.prisma.professor.update({
         data: {
          nome_professor: updateProfessorDto.nomeProfessor.toUpperCase(),
          observacoes: updateProfessorDto.observacoes,
          area_id_area: (+updateProfessorDto.area_id_area)
         },
         where: { id_professor: id }
       });
     } catch (e) {
       throw new InternalServerErrorException("Erro ao atualizar professor");
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


  async findByName(name: string){
    try {
      let professor = await this.prisma.professor.findFirst({
        where:{
          nome_professor:name
        }
      });
      /* console.log(professor); */
      if(!professor){
        return null
      }

      return professor;
    } catch (error) {
      throw new BadRequestException("Erro ao procurar o professor");
    }
  }

  async findByNameAndSemester(idProfessor: number, semestre: number){
    try {
      const professor = await this.prisma.professor.findFirst({
        where: {
          id_professor: idProfessor,
        },
        include: {
          alocacao: {
            include: {
              oferta: {
                include: {
                  disciplina: true,
                  semestre: true,
                },
              },
            },
          },
        },
      });
    
      // Filtra as alocações para manter apenas as disciplinas do semestre especificado
      if (professor) {
        professor.alocacao = professor.alocacao.filter(
          (alocacao) => alocacao.oferta.semestre.id_semestre === semestre
        );
      }

      if (!professor) {
        throw new NotFoundException(`Professor com ID ${idProfessor} não encontrado`);
      }

       // Calcula a carga horária total das disciplinas alocadas no semestre específico
       const totalHoras = professor.alocacao.reduce((acc, alocacao) => {
        // Verifica se a alocação é para o semestre específico
        if (alocacao.oferta.semestre.id_semestre === semestre) {
          // Adiciona a carga horária da disciplina alocada
          return acc + (alocacao.oferta.disciplina.carga_horaria || 0);
        }
        return acc;
      }, 0);
      
      // Divide a carga horária total por 15 para obter as horas semanais
      // Divide a carga horária total por 15 para obter as horas semanais
    const horasSemana = totalHoras / 15;

    return {
      professor,
      horasSemana
    };
      
    } catch (error) {
      throw new BadRequestException("Erro ao procurar o professor");
    }
  }

}
