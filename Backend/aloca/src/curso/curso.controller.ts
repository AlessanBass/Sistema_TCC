import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) { }

  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursoService.create(createCursoDto);
  }

  @Get()
  async findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cursoService.findOne(+id);
  }

  @Get('nome/:nomeCurso')
  async findByNome(@Param('nomeCurso') nome: string) {
    return this.cursoService.findByNome(nome);
  }

  @Get('search/:search')
  async getContains(@Param('search') search: string){
    return this.cursoService.getContains(search);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursoService.update(+id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursoService.remove(+id);
  }
}
