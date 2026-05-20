import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { EstadoSolicitud } from './entities/solicitud-rol.entity';
import { Rol } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request.type';

@UseGuards(JwtAuthGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(
    @Body() body: { congreso_id: string; rol_solicitado: Rol; motivo?: string },
    @Request() req: AuthRequest
  ) {
    return this.solicitudesService.create(req.user.id, body);
  }

  @Get('congreso/:congreso_id')
  findAllByCongreso(
    @Param('congreso_id') congreso_id: string,
    @Request() req: AuthRequest
  ) {
    return this.solicitudesService.findAllByCongreso(congreso_id, req.user.id);
  }

  @Get('usuario/:user_id')
  findByUser(
    @Param('user_id') user_id: string,
    @Request() req: AuthRequest
  ) {
    return this.solicitudesService.findByUser(user_id, req.user.id);
  }

  @Patch(':id/responder')
  resolve(
    @Param('id') id: string,
    @Body() body: { estado: EstadoSolicitud; respuesta?: string },
    @Request() req: AuthRequest
  ) {
    return this.solicitudesService.resolve(id, req.user.id, body);
  }
}
