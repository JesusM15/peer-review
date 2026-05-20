import { Controller, Get, Param, Query, Post, Body, Delete } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Get('revisores')
  findRevisoresConConteo(@Query('congreso_id') congresoId?: string) {
    return this.asignacionesService.findRevisoresConConteo(congresoId);
  }

  @Get()
  findAll(
    @Query('include_relations') includeRelations?: string,
    @Query('revisor_id') revisorId?: string,
    @Query('articulo_id') articuloId?: string,
  ) {
    const include = includeRelations === 'true';
    if (revisorId) {
      return this.asignacionesService.findByRevisor(revisorId, include);
    }
    if (articuloId) {
      return this.asignacionesService.findByArticulo(articuloId, include);
    }
    return this.asignacionesService.findAll(include);
  }

  @Get('revisor/:revisor_id')
  findByRevisor(@Param('revisor_id') revisorId: string, @Query('include_relations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.asignacionesService.findByRevisor(revisorId, include);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('include_relations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.asignacionesService.findOne(id, include);
  }

  @Post()
  create(@Body() body: { articulo_id: string; revisor_id: string; fecha_limite?: string }) {
    return this.asignacionesService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignacionesService.remove(id);
  }
}
