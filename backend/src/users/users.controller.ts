import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Rol } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import type { AuthRequest } from '../auth/types/auth-request.type';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('rol') rol?: string,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    const rolEnum = rol ? (rol as Rol) : undefined;
    return this.usersService.findAll({ rol: rolEnum, include_relations: include });
  }

  @Get('stats')
  async getStats() {
    console.log('Controller getStats called');
    const result = await this.usersService.getStats();
    console.log('Controller getStats result:', result);
    return result;
  }

  @Get('me')
  findMe(@Request() req: AuthRequest) {
    return this.usersService.findMe(req.user.id);
  }

  @Patch('me')
  updateMe(@Request() req: AuthRequest, @Body() body: UpdatePerfilDto) {
    return this.usersService.updateMe(req.user.id, body);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    return this.usersService.findOne(id, include);
  }

  // Admin endpoints
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
