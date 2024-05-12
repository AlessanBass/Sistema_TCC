import { Module } from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { SemestreController } from './semestre.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SemestreController],
  providers: [SemestreService, PrismaService],
})
export class SemestreModule {}
