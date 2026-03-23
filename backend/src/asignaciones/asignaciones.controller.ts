import { Controller, Get, Param, Query } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Get()
  findAll(@Query('include_relations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.asignacionesService.findAll(include);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('include_relations') includeRelations?: string) {
    const include = includeRelations === 'true';
    return this.asignacionesService.findOne(id, include);
  }
}
