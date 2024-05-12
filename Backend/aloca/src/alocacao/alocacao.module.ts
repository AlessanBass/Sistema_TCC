import { Module } from '@nestjs/common';
import { AlocacaoService } from './alocacao.service';
import { AlocacaoController } from './alocacao.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AlocacaoController],
  providers: [AlocacaoService, PrismaService],
})
export class AlocacaoModule {}
