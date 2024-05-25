import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Controller('disciplina')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @Post()
  async create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.disciplinaService.create(createDisciplinaDto);
  }

  @Get()
  async findAll() {
    return this.disciplinaService.findAll();
  }

  @Get('curso/:idCurso')
  async findDisciplinaByCurso(@Param('idCurso') id_curso: string){
    return this.disciplinaService.findDisciplinaByCurso(+id_curso);
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.disciplinaService.findOne(+id);
  }

  @Get('findByCodAndCurso/:cod/:nameDisciplina/:idCurso')
  async findByCodAndCurso(@Param('id') cod: string, @Param('nameDisciplina') nameDisciplina: string, @Param('idCurso') idCurso: string){
      return this.disciplinaService.findOneCodAndCurso(cod, nameDisciplina, +idCurso);
  }

  @Get('cod/:cod')
  async findOneCod(@Param('cod') cod: string){
    return this.disciplinaService.findOneCod(cod);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDisciplinaDto: UpdateDisciplinaDto) {
    return this.disciplinaService.update(+id, updateDisciplinaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.disciplinaService.remove(+id);
  }
}
