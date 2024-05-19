import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { EnvioIndicacaoService } from './envio_indicacao.service';
import { CreateEnvioIndicacaoDto } from './dto/create-envio_indicacao.dto';
import { UpdateEnvioIndicacaoDto } from './dto/update-envio_indicacao.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('envio-indicacao')
export class EnvioIndicacaoController {
  constructor(private readonly envioIndicacaoService: EnvioIndicacaoService) { }

  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadIndicacao')
  async create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const path = join(__dirname, '..', '..', 'storage', file.originalname);
    try {
      const saveFile =  await this.envioIndicacaoService.upload(file, path);
      if(saveFile){
        return await this.envioIndicacaoService.readExecel(file, path);
      }
    } catch (error) {
      throw new BadRequestException("Controller: Erro ao salvar arquivo!");
    }
  }


}
