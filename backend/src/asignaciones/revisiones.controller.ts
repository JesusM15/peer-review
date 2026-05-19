import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';

@Controller('revisiones')
export class RevisionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Post()
  submit(@Body() body: {
    articulo_id: string;
    revisor_id: string;
    decision: string;
    comentarios: any;
    fecha_revision: string;
  }) {
    return this.asignacionesService.submitRevision(body);
  }

  @Get()
  findOne(@Query('articulo_id') articulo_id: string, @Query('revisor_id') revisor_id: string) {
    return this.asignacionesService.findRevision(articulo_id, revisor_id);
  }
}
