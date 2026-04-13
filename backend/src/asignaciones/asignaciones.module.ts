import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Asignacion } from './entities/asignacion.entity';
import { Revision, RevisionSchema } from './schemas/revision.schema';
import { User } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { AsignacionesController } from './asignaciones.controller';
import { AsignacionesService } from './asignaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asignacion, User, Perfil]),
    MongooseModule.forFeature([{ name: Revision.name, schema: RevisionSchema }]),
  ],
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  exports: [TypeOrmModule, MongooseModule, AsignacionesService],
})
export class AsignacionesModule {}
