import { Controller, Get, Param, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { StaffChatService } from './staff-chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CongresosService } from '../congresos/congresos.service';
import { Rol } from '../users/entities/user.entity';

@Controller('staff-chat')
export class StaffChatController {
  constructor(private readonly staffService: StaffChatService, private readonly congresosService: CongresosService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':congresoId/history')
  async getHistory(@Request() req, @Param('congresoId') congresoId: string, @Query('limit') limit = '50', @Query('before') before?: string) {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) throw new BadRequestException('Usuario no autenticado');

    const memberships = await this.congresosService.getMemberships(userId);
    // Revisores, Editors, and Admins can read history
    const allowed = memberships.some(m => m.congreso_id === congresoId && (m.rol === Rol.EDITOR || m.rol === Rol.ADMIN || m.rol === Rol.REVISOR));
    if (!allowed) throw new BadRequestException('No autorizado en este congreso');

    const lim = parseInt(limit, 10) || 50;
    const docs = await this.staffService.getHistory(congresoId, lim, before);
    return docs;
  }
}
