import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  async create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmaService.create(createTurmaDto);
  }

  @Get()
  async findAll() {
    return this.turmaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.turmaService.findOne(+id);
  }

  @Get('name/:name')
  async findOneCod(@Param('name') name: string){
    return this.turmaService.findOneName(name);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmaService.update(+id, updateTurmaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.turmaService.remove(+id);
  }
}
