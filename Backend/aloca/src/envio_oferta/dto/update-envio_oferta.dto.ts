import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvioOfertaDto } from './create-envio_oferta.dto';

export class UpdateEnvioOfertaDto extends PartialType(CreateEnvioOfertaDto) {}
