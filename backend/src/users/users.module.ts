import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Perfil } from './entities/perfil.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';
import { Revision, RevisionSchema } from '../asignaciones/schemas/revision.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Perfil, Articulo, Asignacion]),
    MongooseModule.forFeature([{ name: Revision.name, schema: RevisionSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
