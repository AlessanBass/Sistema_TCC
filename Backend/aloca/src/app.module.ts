import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessorModule } from './professor/professor.module';
import { PrismaModule } from './prisma/prisma.module';
import { AreaModule } from './area/area.module';

@Module({
  imports: [ProfessorModule, PrismaModule, AreaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
