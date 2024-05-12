import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlocacaoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAlocacaoDto: CreateAlocacaoDto) {
    return 'This action adds a new alocacao';
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
    
  }

  async update(id: number, updateAlocacaoDto: UpdateAlocacaoDto) {
    return `This action updates a #${id} alocacao`;
  }

  async remove(id: number) {
    return `This action removes a #${id} alocacao`;
  }
}
