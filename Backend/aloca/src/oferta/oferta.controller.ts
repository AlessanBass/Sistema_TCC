import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfertaService } from './oferta.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { UpdateOfertaDto } from './dto/update-oferta.dto';

@Controller('oferta')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) {}

  @Post()
  async create(@Body() createOfertaDto: CreateOfertaDto) {
    return this.ofertaService.create(createOfertaDto);
  }

  @Get()
  async findAll() {
    return this.ofertaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ofertaService.findOne(+id);
  }

  @Get('find-by-area/:idArea')
  async findByArea(@Param('idArea') id_area: string){
    return this.ofertaService.findByArea(+id_area);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOfertaDto: UpdateOfertaDto) {
    return this.ofertaService.update(+id, updateOfertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofertaService.remove(+id);
  }
}
