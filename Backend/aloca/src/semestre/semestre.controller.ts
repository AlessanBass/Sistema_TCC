import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';

@Controller('semestre')
export class SemestreController {
  constructor(private readonly semestreService: SemestreService) { }

  @Post()
  async create(@Body() createSemestreDto: CreateSemestreDto) {
    return this.semestreService.create(createSemestreDto);
  }

  @Get()
  async findAll() {
    return this.semestreService.findAll();
  }

  @Get('lastest')
  async lastest() {
    return this.semestreService.findLatest();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.semestreService.findOne(+id);
  }

  @Get('nome/:nomeSemestre')
  async findByNome(@Param('nomeSemestre') nome: string) {
    return this.semestreService.findByNome(nome);
  }

  
 

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSemestreDto: UpdateSemestreDto) {
    return this.semestreService.update(+id, updateSemestreDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.semestreService.remove(+id);
  }
}
