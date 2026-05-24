import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Query,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { PushService } from './push.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request.type';
import { PushSubscribeDto } from './dto/push-subscribe.dto';

@UseGuards(JwtAuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(
    private readonly service: NotificacionesService,
    private readonly pushService: PushService,
  ) {}

  @Get()
  findMine(@Request() req: AuthRequest, @Query('no_leidas') noLeidas?: string) {
    return this.service.findByUser(req.user.id, noLeidas === 'true');
  }

  @Get('contar-no-leidas')
  async contar(@Request() req: AuthRequest) {
    const total = await this.service.contarNoLeidas(req.user.id);
    return { total };
  }

  @Get('push/vapid-public-key')
  getVapidPublicKey() {
    const publicKey = this.pushService.getPublicKey();
    if (!publicKey) {
      throw new NotFoundException(
        'Las notificaciones push no están configuradas en el servidor.',
      );
    }
    return { publicKey, enabled: this.pushService.isEnabled() };
  }

  @Post('push/subscribe')
  subscribe(@Request() req: AuthRequest, @Body() dto: PushSubscribeDto) {
    return this.pushService.subscribe(req.user.id, dto);
  }

  @Delete('push/unsubscribe')
  unsubscribe(
    @Request() req: AuthRequest,
    @Body() body: { endpoint: string },
  ) {
    return this.pushService.unsubscribe(req.user.id, body.endpoint);
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
