import { Module } from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { OfertaController } from './oferta.controller';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AreaService } from 'src/area/area.service';
import { CursoService } from 'src/curso/curso.service';
import { SemestreService } from 'src/semestre/semestre.service';
import { AlocacaoService } from 'src/alocacao/alocacao.service';

@Module({
  controllers: [OfertaController],
  providers: [OfertaService, PrismaService, DisciplinaService, AreaService, CursoService, SemestreService, AlocacaoService],
})
export class OfertaModule {}
