import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessorModule } from './professor/professor.module';
import { PrismaModule } from './prisma/prisma.module';
import { AreaModule } from './area/area.module';
import { OfertaModule } from './oferta/oferta.module';
import { CursoModule } from './curso/curso.module';

@Module({
  imports: [ProfessorModule, PrismaModule, AreaModule, OfertaModule, CursoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
