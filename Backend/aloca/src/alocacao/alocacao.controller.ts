import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlocacaoService } from './alocacao.service';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';

@Controller('alocacao')
export class AlocacaoController {
  constructor(private readonly alocacaoService: AlocacaoService) {}

  @Post(':turma')
  async create(@Body() createAlocacaoDto: CreateAlocacaoDto, @Param('turma') turma: string) {
    return this.alocacaoService.create(createAlocacaoDto, turma);
  }

  @Get()
  async findAll() {
    return this.alocacaoService.findAll();
  }

  @Get('findByColegiado/:id_colegiado')
  async findByColegiado(@Param('id_colegiado') id_colegiado: string){
    return this.alocacaoService.findByColegiado(+id_colegiado);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.alocacaoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAlocacaoDto: UpdateAlocacaoDto) {
    return this.alocacaoService.update(+id, updateAlocacaoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.alocacaoService.remove(+id);
  }
}
