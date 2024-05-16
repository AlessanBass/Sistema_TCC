import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { throwError } from 'rxjs';
import { serialize } from 'v8';

@Injectable()
export class CursoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCursoDto: CreateCursoDto) {
    try {
      /* Falta verificar se já existe um curso com esse nome */

      return this.prisma.curso.create({
        data:{
          nome_curso: createCursoDto.nomeCurso,
          tipo_curso: createCursoDto.tipoCurso
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao cadastrar novo curso");
    }
  }

  async findAll() {
    try {
      return this.prisma.curso.findMany({
        orderBy:{
          nome_curso: 'asc'
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar os cursos");
    }
  }

  async findOne(id: number) {
    try {
      const curso = await this.prisma.curso.findUnique({
        where: { id_curso: id }
      });

      if (!curso) {
        throw new NotFoundException(`Curso com id ${id} não encontrado`);
      }

      return curso;

    } catch (e) {
      throw new BadRequestException("Erro ao buscar o curso");
    }
  }

  async findByNome(nome: string) {
    try{
      const curso = await this.prisma.curso.findMany({
        where: {
          nome_curso: nome,
        },
      });

      /* Posso retornar um array vazio para indicar que não existe esse curso ainda */

     /*  if(curso.length === 0){
        throw new NotFoundException("Não existe curso com essse nome");
      } */

      return curso;

    }catch(e){
      throw new NotFoundException("Erro ao buscar curso por esse nome");
    }
    
  }

 
  async getContains(search:string){
    try{
      const curso = await this.prisma.curso.findMany({
        where: {
          nome_curso:{
            contains:search
          }
        },
      });

      /* Posso retornar um array vazio para indicar que não existe esse curso ainda */

     /*  if(curso.length === 0){
        throw new NotFoundException("Não existe curso com essse nome");
      } */

      return curso;

    }catch(e){
      throw new NotFoundException("Erro ao buscar curso por esse nome");
    }
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
  /*verificar se o curso existe  */
  const curso = await this.findOne(id);

    try {
      return this.prisma.curso.update({
        data:{
          nome_curso: updateCursoDto.nomeCurso,
          tipo_curso: updateCursoDto.tipoCurso,
        },
        where:{id_curso: id}
      });
    } catch (e) {
      throw new NotFoundException("Erro ao atualizar curso");
    }
  }

  async remove(id: number) {
    /* Verifica se o curso existe */
    const curso = await this.findOne(id);

    try {
      return this.prisma.curso.delete({
        where:{id_curso:id}
      });
    } catch (e) {
      throw new NotFoundException("Erro ao deletar curso");
    }
  }
}
