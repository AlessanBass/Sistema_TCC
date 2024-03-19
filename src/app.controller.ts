import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async upload(@UploadedFile() file: Express.Multer.File){
     const path = join(__dirname, '..', 'storage', file.originalname);
     writeFile(path, file.buffer);
     this.appService.readExecel(file, path);

  }
}
