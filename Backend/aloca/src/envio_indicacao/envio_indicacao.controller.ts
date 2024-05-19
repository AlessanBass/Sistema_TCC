import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { EnvioIndicacaoService } from './envio_indicacao.service';
import { CreateEnvioIndicacaoDto } from './dto/create-envio_indicacao.dto';
import { UpdateEnvioIndicacaoDto } from './dto/update-envio_indicacao.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';

@Controller('envio-indicacao')
export class EnvioIndicacaoController {
  constructor(private readonly envioIndicacaoService: EnvioIndicacaoService) { }

  @Get('downloadByColegiado/:idColegiado/:idSemestre')
  /* @Res() res: Response,   */
  async download(@Res() res: Response, @Param('idColegiado') id_colegiado: string, @Param('idSemestre') id_semestre: string){
    const colegiado = await this.envioIndicacaoService.findOneCurso(+id_colegiado);
    const semestre = await this.envioIndicacaoService.finOneSemestre(+id_semestre);
    const nomeSemestre = encodeURIComponent(semestre.nome_semestre);
    const nomeColegiado = encodeURIComponent(colegiado.nome_curso);
    const texto = encodeURIComponent("Envio SEI");
    const filename = `${texto}  ${nomeSemestre} - ${nomeColegiado}.xlsx`;

    const buffer = await this.envioIndicacaoService.download(+id_colegiado, +id_semestre);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }

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
