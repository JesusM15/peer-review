import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Asignacion } from './entities/asignacion.entity';
import { Revision, RevisionSchema } from './schemas/revision.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asignacion]),
    MongooseModule.forFeature([{ name: Revision.name, schema: RevisionSchema }]),
  ],
  exports: [TypeOrmModule, MongooseModule],
})
export class AsignacionesModule {}
