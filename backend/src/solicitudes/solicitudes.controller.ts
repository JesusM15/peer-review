import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { EstadoSolicitud } from './entities/solicitud-rol.entity';
import { Rol } from '../users/entities/user.entity';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() body: { user_id: string; congreso_id: string; rol_solicitado: Rol; motivo?: string }) {
    return this.solicitudesService.create(body);
  }

  @Get('congreso/:congreso_id')
  findAllByCongreso(@Param('congreso_id') congreso_id: string) {
    return this.solicitudesService.findAllByCongreso(congreso_id);
  }

  @Get('usuario/:user_id')
  findByUser(@Param('user_id') user_id: string) {
    return this.solicitudesService.findByUser(user_id);
  }

  @Patch(':id/responder')
  resolve(
    @Param('id') id: string,
    @Body() body: { estado: EstadoSolicitud; respuesta?: string }
  ) {
    return this.solicitudesService.resolve(id, body);
  }
}
