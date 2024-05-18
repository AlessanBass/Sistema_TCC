import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OfertaService {
  constructor(private readonly prisma: PrismaService){}

  async create(createOfertaDto: CreateOfertaDto) {
   const ofertaExistente = await this.verificaEquals(createOfertaDto);
   if(ofertaExistente){
    return null;
   }
    try {
      return this.prisma.oferta.create({
        data: {
          turma: createOfertaDto.turma,
          formandos: createOfertaDto.formandos,
          obs_colegiado: createOfertaDto.obs_colegiados,
          disciplina_id_disciplina: (+createOfertaDto.disciplina_id_disciplina),
          semestre_id_semestre: (+createOfertaDto.semestre_id_semestre),
          curso_id_curso: (+createOfertaDto.curso_id_curso)
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao cadastrar nova oferta");
    }
  }

  async findAll() {
    try {
      return this.prisma.oferta.findMany({
        include:{
          disciplina:true,
          curso: true
        }
      });
    } catch (error) {
      throw new BadRequestException("Erro ao solicitar ofertas");
    }
  }

  async findOne(id: number) {
    try {
      return this.prisma.oferta.findFirst({
        where: {
          id_oferta: id
        }
      });
    } catch (e) {
      throw new BadRequestException("Erro ao buscar a oferta");
    }
  }

  async verificaEquals(createOfertaDto: CreateOfertaDto){
    const ofertaExistente = await this.prisma.oferta.findFirst({
      where: {
        disciplina_id_disciplina: (+createOfertaDto.disciplina_id_disciplina),
        turma: createOfertaDto.turma
      }
    });

     return ofertaExistente;
  }

  async update(id: number, updateOfertaDto: UpdateOfertaDto) {
    return `This action updates a #${id} oferta`;
  }

  async remove(id: number) {
    return `This action removes a #${id} oferta`;
  }
}
