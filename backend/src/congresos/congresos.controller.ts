import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
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
  create(
    @Body() body: { nombre: string; descripcion?: string; tags?: string[] },
  ) {
    return this.congresosService.createCongreso(
      body.nombre,
      body.descripcion,
      body.tags,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.congresosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { nombre?: string; descripcion?: string; tags?: string[] },
  ) {
    return this.congresosService.updateCongreso(
      id,
      body.nombre,
      body.descripcion,
      body.tags,
    );
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
  assignEditor(
    @Param('id') id: string,
    @Body() body: { userId: string; tagId: string },
  ) {
    return this.congresosService.assignEditorToTag(body.userId, body.tagId, id);
  }

  @Post(':id/assign-revisor')
  assignRevisor(
    @Param('id') id: string,
    @Body() body: { userId: string; tagId: string },
  ) {
    return this.congresosService.assignRevisorToTag(
      body.userId,
      body.tagId,
      id,
    );
  }

  @Get(':id/revisor/:userId/tags')
  getRevisorTags(@Param('id') id: string, @Param('userId') userId: string) {
    return this.congresosService.getRevisorTags(userId, id);
  }

  @Delete('revisor-tag/:revisorTagId')
  removeRevisorTag(@Param('revisorTagId') revisorTagId: string) {
    return this.congresosService.removeRevisorTag(revisorTagId);
  }

  @Post(':id/congreso-tags')
  assignCongresoTag(@Param('id') id: string, @Body() body: { tagId: string }) {
    return this.congresosService.assignCongresoTag(id, body.tagId);
  }

  @Get(':id/congreso-tags')
  getCongresoTags(@Param('id') id: string) {
    return this.congresosService.getCongresoTags(id);
  }

  @Delete('congreso-tag/:congresoTagId')
  removeCongresoTag(@Param('congresoTagId') congresoTagId: string) {
    return this.congresosService.removeCongresoTag(congresoTagId);
  }

  @Get(':id/validate-revisor/:userId')
  validateRevisor(
    @Param('id') congresoId: string,
    @Param('userId') userId: string,
  ) {
    return this.congresosService.validateRevisorForCongreso(userId, congresoId);
  }

  @Get(':id/validate-editor/:userId')
  validateEditor(
    @Param('id') congresoId: string,
    @Param('userId') userId: string,
  ) {
    return this.congresosService.validateEditorForCongreso(userId, congresoId);
  }
}
