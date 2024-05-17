import { Module } from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { OfertaController } from './oferta.controller';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AreaService } from 'src/area/area.service';
import { CursoService } from 'src/curso/curso.service';
import { TurmaService } from 'src/turma/turma.service';

@Module({
  controllers: [OfertaController],
  providers: [OfertaService, PrismaService, DisciplinaService, AreaService, CursoService, TurmaService],
})
export class OfertaModule {}
