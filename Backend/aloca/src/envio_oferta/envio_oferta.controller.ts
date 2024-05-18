import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { EnvioOfertaService } from './envio_oferta.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('envio-oferta')
export class EnvioOfertaController {
  constructor(private readonly envioOfertaService: EnvioOfertaService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadOferta')
  async create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    
    const path = join(__dirname, '..', '..', 'storage', file.originalname);
     try {
      const saveFile =  await this.envioOfertaService.upload(file, path);
      if(saveFile){
        return await this.envioOfertaService.readExecel(file, path);
      }
     } catch (e) {
      throw new BadRequestException("Controller: Erro ao salvar arquivo!");
    } 
  }

  
}
