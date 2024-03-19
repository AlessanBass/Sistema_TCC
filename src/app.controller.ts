import { BadRequestException, Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from './file/file.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileService: FileService
    ) {}

  @Render('index')
  @Get()
  index() {
    return {msg: "Mensagem passada com handlebras"}
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadExel')
  async upload(@UploadedFile() file: Express.Multer.File){
     const path = join(__dirname, '..', 'storage', file.originalname);

     try{
      this.fileService.upload(file, path);
     }catch(e){
      throw new BadRequestException("Erro ao salvar arquivo!");
     }

     this.fileService.readExecel(file, path);
    
  }
}
