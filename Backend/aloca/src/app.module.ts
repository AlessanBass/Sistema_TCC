import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessorModule } from './professor/professor.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProfessorModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
