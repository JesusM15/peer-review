import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Rol } from './entities/user.entity';

@Controller('users')
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

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    return this.usersService.findOne(id, include);
  }
}
