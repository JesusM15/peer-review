import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Get()
  findAll(@Query('include_relations') includeRelations?: string, @Query('revisor_id') revisorId?: string) {
    const include = includeRelations === 'true';
    if (revisorId) {
      return this.asignacionesService.findByRevisor(revisorId, include);
    }
    return this.asignacionesService.findAll(include);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('include_relations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.asignacionesService.findOne(id, include);
  }

  @Get('revisor/:revisor_id')
  findByRevisor(@Param('revisor_id') revisorId: string, @Query('include_relations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.asignacionesService.findByRevisor(revisorId, include);
  }
}
