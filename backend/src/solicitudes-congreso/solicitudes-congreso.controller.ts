import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { SolicitudesCongresoService } from './solicitudes-congreso.service';
import { CreateSolicitudCongresoDto } from './dto/create-solicitud-congreso.dto';
import { ResolveSolicitudCongresoDto } from './dto/resolve-solicitud-congreso.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Rol } from '../users/entities/user.entity';
import type { AuthRequest } from '../auth/types/auth-request.type';

@UseGuards(JwtAuthGuard)
@Controller('solicitudes-congreso')
export class SolicitudesCongresoController {
  constructor(private readonly service: SolicitudesCongresoService) {}

  @Post()
  create(
    @Body() body: CreateSolicitudCongresoDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.create(req.user.id, body);
  }

  @Get('mias')
  findMyOwn(@Request() req: AuthRequest) {
    return this.service.findByUser(req.user.id);
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.findAll();
  }

  @Get('pendientes')
  findPendientes(@Request() req: AuthRequest) {
    this.ensureAdmin(req);
    return this.service.findPendientes();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.service.findOne(id, { id: req.user.id, rol: req.user.rol });
  }

  @Patch(':id/resolver')
  resolve(
    @Param('id') id: string,
    @Body() body: ResolveSolicitudCongresoDto,
    @Request() req: AuthRequest,
  ) {
    this.ensureAdmin(req);
    return this.service.resolve(id, req.user.id, body);
  }

  private ensureAdmin(req: AuthRequest) {
    if (req.user.rol !== Rol.ADMIN) {
      throw new ForbiddenException(
        'Solo el administrador puede realizar esta acción.',
      );
    }
  }
}
