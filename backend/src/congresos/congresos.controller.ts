import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CongresosService } from './congresos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Rol } from '../users/entities/user.entity';

@Controller('congresos')
export class CongresosController {
  constructor(private readonly congresosService: CongresosService) {}

  @Get()
  findAll() {
    return this.congresosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-memberships')
  getMyMemberships(@Request() req) {
    return this.congresosService.getMemberships(req.user.id);
  }

  @Post()
  create(@Body() body: { nombre: string; descripcion?: string }) {
    return this.congresosService.createCongreso(body.nombre, body.descripcion);
  }

  @Post(':id/tags')
  addTag(@Param('id') id: string, @Body() body: { nombre: string }) {
    return this.congresosService.addTag(id, body.nombre);
  }

  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Body() body: { userId: string; rol: Rol }) {
    return this.congresosService.enrollUser(body.userId, id, body.rol);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Param('id') id: string, @Request() req) {
    return this.congresosService.enrollUser(req.user.id, id, Rol.AUTOR);
  }

  @Post(':id/assign-editor')
  assignEditor(@Param('id') id: string, @Body() body: { userId: string; tagId: string }) {
    return this.congresosService.assignEditorToTag(body.userId, body.tagId, id);
  }
}
