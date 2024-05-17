import { Module } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TurmaController],
  providers: [TurmaService, PrismaService],
})
export class TurmaModule {}
