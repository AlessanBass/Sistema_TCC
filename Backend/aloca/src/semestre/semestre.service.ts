import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SemestreService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createSemestreDto: CreateSemestreDto) {
    const verificaNome = await this.findByNome(createSemestreDto.nomeSemestre);
    if(verificaNome.length > 0){
      throw new BadRequestException("Já existe semestre com esse nome!");
    }

    try {
      /* Falta verificar se já existe um curso com esse nome */

      return this.prisma.semestre.create({
        data:{
          nome_semestre: createSemestreDto.nomeSemestre,
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao cadastrar novo semestre");
    }
  }

  async findAll() {
    try {
      return this.prisma.semestre.findMany({
        orderBy:{
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
    /* Verifica se o curso existe */
    const semestre = await this.findOne(id);
    try {
      return this.prisma.semestre.update({
        data:{
          nome_semestre: updateSemestreDto.nomeSemestre,
        },
        where:{id_semestre: id}
      });
    } catch (e) {
      throw new NotFoundException("Erro ao atualizar semestre");
    }
  }

  async remove(id: number) {
    /* Verifica se o curso existe */
    const semestre = await this.findOne(id);

    try {
      return this.prisma.semestre.delete({
        where:{id_semestre:id}
      });
    } catch (e) {
      throw new NotFoundException("Erro ao deletar semestre");
    }
  }

  async findByNome(nome: string) {
    try{
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

    }catch(e){
      throw new NotFoundException("Erro ao buscar curso por esse nome");
    }
    
  }
}
