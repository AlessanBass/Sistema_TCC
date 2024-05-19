import { Module } from '@nestjs/common';
import { EnvioIndicacaoService } from './envio_indicacao.service';
import { EnvioIndicacaoController } from './envio_indicacao.controller';
import { AreaService } from 'src/area/area.service';
import { ProfessorService } from 'src/professor/professor.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { OfertaService } from 'src/oferta/oferta.service';
import { AlocacaoService } from 'src/alocacao/alocacao.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EnvioIndicacaoController],
  providers: [EnvioIndicacaoService, PrismaService, AreaService, ProfessorService, DisciplinaService, OfertaService, AlocacaoService],
})
export class EnvioIndicacaoModule {}