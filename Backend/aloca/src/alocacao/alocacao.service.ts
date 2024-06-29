import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlocacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAlocacaoDto: CreateAlocacaoDto, turma: string) {
    let retorno = await this.verificaEquals(createAlocacaoDto, turma);
    if (retorno) {
      return null;
    }
    try {
      let retorno = await this.prisma.alocacao.create({
        data: {
          oferta_id_oferta: (+createAlocacaoDto.oferta_id_oferta),
          professor_id_professor: (+createAlocacaoDto.professor_id_professor)
        }
      });
      if (retorno) {
        return retorno;
      } else {
        throw new Error('A resposta do Prisma não contém um ID de alocação.');
      }

    } catch (e) {
      console.error('Erro ao cadastrar nova alocação:', e);
      throw new BadRequestException("Erro ao cadastrar nova alocação");
    }
  }

  async findAll() {
    try {
      return this.prisma.alocacao.findMany({
        include: {
          oferta: {
            include: {
              disciplina: true
            }
          },
          professor: true,
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
     oferta.*,
     professor.*
     FROM alocacao
     INNER JOIN oferta ON alocacao.oferta_id_oferta = oferta.id_oferta
     INNER JOIN professor ON alocacao.professor_id_professor = professor.id_professor
     WHERE alocacao.id_alocacao = ${id}
     `;
  }

  async update(id: number, updateAlocacaoDto: UpdateAlocacaoDto) {
    try {
      let query = `UPDATE alocacao SET `;
      let valores: any[] = [];

      if (updateAlocacaoDto.oferta_id_oferta != undefined) {
        query += `observacoes_colegiado = ? , `;
        valores.push(updateAlocacaoDto.oferta_id_oferta);
      }

      if (updateAlocacaoDto.professor_id_professor != undefined) {
        query += `observacoes_colegiado = ? , `;
        valores.push(updateAlocacaoDto.professor_id_professor);
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

  async verificaEquals(createAlocacaoDto: CreateAlocacaoDto, turmaParametro: string) {
    // Exibir os dados de entrada para debug
    /*  */
    console.log('------TENTEI CRIAR A ALOCACAO------------------');
    console.log(createAlocacaoDto);
    console.log('------------------------------------------------');

    // Buscar os dados da oferta com base no ID da oferta
    const oferta_id_semstre = await this.prisma.oferta.findUnique({
      where: {
        id_oferta: (+createAlocacaoDto.oferta_id_oferta),
      }
    });

    // Exibir o semestre_id_semestre da oferta encontrada para debug
/*     console.log(oferta_id_semstre.semestre_id_semestre); */

    try {
      // Buscar a primeira alocação que corresponda aos critérios fornecidos, excluindo a oferta atual
      const alocacaoExistente = await this.prisma.alocacao.findFirst({
        where: {
          professor_id_professor: (+createAlocacaoDto.professor_id_professor),
          oferta: {
            turma: turmaParametro,
            semestre_id_semestre: oferta_id_semstre.semestre_id_semestre,
            id_oferta: (+createAlocacaoDto.oferta_id_oferta)
          },
        }
      });

      // Exibir a alocação encontrada para debug
      console.log('------Alocacao já existe------------------');
      console.log(alocacaoExistente);
      console.log('-------------------------------------------');


      // Retornar null se nenhuma alocação for encontrada
      if (!alocacaoExistente) {
        return null;
      }

      // Retornar a alocação encontrada
      return alocacaoExistente;
    } catch (error) {
      // Exibir o erro para debug
      /* console.log(error); */
      // Lançar uma exceção se ocorrer um erro durante a busca
      throw new BadRequestException("Erro ao buscar alocação com base na oferta e turma");
    }
  }


  async findByColegiado(id_colegiado: number) {
    try {
      const retorno = await this.prisma.alocacao.findMany({
        where: {
          oferta: {
            disciplina: {
              curso: {
                id_curso: id_colegiado
              }
            }
          }
        },
        include: {
          oferta: {
            include: {
              disciplina: {
                include: {
                  curso: true
                }
              },
              area: true
            }
          },
          professor: true
        },
        orderBy: {
          oferta: {
            disciplina: {
              nome_disciplina: 'asc'
            }
          }
        }
      });

      if (!retorno) {
        return null;
      }

      return retorno;

    } catch (error) {
      throw new BadRequestException("Erro ao buscar alocação por colegiado!");
    }
  }

  async findByColegiadoBySemestre(idColegiado: number, idSemestre: number) {
    try {
      const retorno = await this.prisma.alocacao.findMany({
        where: {
          oferta: {
            disciplina: {
              curso: {
                id_curso: idColegiado
              }
            },
            semestre_id_semestre: idSemestre
          }
        },
        include: {
          oferta: {
            include: {
              disciplina: {
                include: {
                  curso: true
                }
              },
              area: true
            }
          },
          professor: true
        },
        orderBy: {
          oferta: {
            disciplina: {
              nome_disciplina: 'asc'
            }
          }
        }
      });

      if (!retorno) {
        return null;
      }

      return retorno;

    } catch (error) {
      throw new BadRequestException("Erro ao buscar alocação por colegiado!");
    }
  }
}
