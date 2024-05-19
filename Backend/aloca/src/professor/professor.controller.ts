import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get()
  async findAll(@Query('area') area?: string) {
    if(area){
      return this.professorService.findByArea(area);
    }else{
      return this.professorService.findAll();
    }
    /* http://localhost:3000/professor?area=1 (Parametro opcional)*/
  }

  @Post()
  async create(@Body() createProfessorDto: CreateProfessorDto) {
    //console.log(createProfessorDto);
    return this.professorService.create(createProfessorDto);
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.professorService.findOne(+id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string){
    return this.professorService.findByName(name);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProfessorDto: UpdateProfessorDto) {
    return this.professorService.update(+id, updateProfessorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.professorService.remove(+id);
  }
}
