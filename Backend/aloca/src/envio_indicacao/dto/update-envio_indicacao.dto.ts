import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvioIndicacaoDto } from './create-envio_indicacao.dto';

export class UpdateEnvioIndicacaoDto extends PartialType(CreateEnvioIndicacaoDto) {}
