import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request.type';

@UseGuards(JwtAuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly service: NotificacionesService) {}

  @Get()
  findMine(@Request() req: AuthRequest, @Query('no_leidas') noLeidas?: string) {
    return this.service.findByUser(req.user.id, noLeidas === 'true');
  }

  @Get('contar-no-leidas')
  async contar(@Request() req: AuthRequest) {
    const total = await this.service.contarNoLeidas(req.user.id);
    return { total };
  }

  @Patch(':id/leer')
  marcarLeida(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.service.marcarLeida(id, req.user.id);
  }

  @Patch('leer-todas')
  marcarTodasLeidas(@Request() req: AuthRequest) {
    return this.service.marcarTodasLeidas(req.user.id);
  }
}
