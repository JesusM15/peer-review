import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { EstadoArticulo } from './entities/articulo.entity';

@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  create(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articulosService.create(createArticuloDto);
  }

  @Get()
  findAll(
    @Query('autor_id') autor_id?: string,
    @Query('estado') estado?: EstadoArticulo,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    return this.articulosService.findAll({ autor_id, estado, include_relations: include });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    return this.articulosService.findOne(id, include);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto) {
    return this.articulosService.update(id, updateArticuloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articulosService.remove(id);
  }
}
