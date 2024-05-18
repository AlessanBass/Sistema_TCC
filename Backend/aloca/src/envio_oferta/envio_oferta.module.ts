import { Module } from '@nestjs/common';
import { EnvioOfertaService } from './envio_oferta.service';
import { EnvioOfertaController } from './envio_oferta.controller';
import { OfertaService } from 'src/oferta/oferta.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { SemestreService } from 'src/semestre/semestre.service';
import { CursoService } from 'src/curso/curso.service';
import { AreaService } from 'src/area/area.service';

@Module({
  controllers: [EnvioOfertaController],
  providers: [EnvioOfertaService, PrismaService, OfertaService, DisciplinaService, SemestreService, CursoService, AreaService],
})
export class EnvioOfertaModule {}
