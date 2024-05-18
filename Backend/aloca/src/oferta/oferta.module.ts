import { Module } from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { OfertaController } from './oferta.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OfertaController],
  providers: [OfertaService, PrismaService],
})
export class OfertaModule {}
