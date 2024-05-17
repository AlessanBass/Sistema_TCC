import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('oferta')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) { }

  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadOferta')
  async create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    
    const path = join(__dirname, '..', '..', 'storage', file.originalname);

     try {
      const saveFile =  await this.ofertaService.upload(file, path);
      if(saveFile){
        return await this.ofertaService.readExecel(file, path);
      }
     } catch (e) {
      throw new BadRequestException("Controller: Erro ao salvar arquivo!");
    } 
  }

 /*  @Get()
  findAll() {
    return this.ofertaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ofertaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfertaDto: UpdateOfertaDto) {
    return this.ofertaService.update(+id, updateOfertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertaService.remove(+id);
  } */
}
