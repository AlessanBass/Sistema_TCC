import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessorModule } from './professor/professor.module';
import { PrismaModule } from './prisma/prisma.module';
import { AreaModule } from './area/area.module';
import { CursoModule } from './curso/curso.module';
import { SemestreModule } from './semestre/semestre.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { AlocacaoModule } from './alocacao/alocacao.module';
import { EnvioOfertaModule } from './envio_oferta/envio_oferta.module';
import { OfertaModule } from './oferta/oferta.module';
import { EnvioIndicacaoModule } from './envio_indicacao/envio_indicacao.module';

@Module({
  imports: [ProfessorModule, PrismaModule, AreaModule, CursoModule, SemestreModule, DisciplinaModule, AlocacaoModule, EnvioOfertaModule, OfertaModule, EnvioIndicacaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
