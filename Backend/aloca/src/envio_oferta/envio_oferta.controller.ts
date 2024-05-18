import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { EnvioOfertaService } from './envio_oferta.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';

@Controller('envio-oferta')
export class EnvioOfertaController {
  constructor(private readonly envioOfertaService: EnvioOfertaService) {}

  @Get('downloadByArea/:idArea/:idSemestre')
  //@Res() resposnse: Response,
  async download( @Res() res: Response, @Param('idArea') id_area: string, @Param('idSemestre') id_semestre: string){
    /* return this.envioOfertaService.download(+id_area, +id_semestre); */
    const buffer = await this.envioOfertaService.download(+id_area, +id_semestre);
    res.setHeader('Content-Disposition', 'attachment; filename=meu-arquivo-por-area.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } 

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
