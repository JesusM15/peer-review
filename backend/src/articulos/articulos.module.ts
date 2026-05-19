import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Articulo } from './entities/articulo.entity';
import { ArticuloTag } from './entities/articulo-tag.entity';
import { ArticuloDetalle, ArticuloDetalleSchema } from './schemas/articulo-detalle.schema';
import { Revision, RevisionSchema } from '../asignaciones/schemas/revision.schema';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo, ArticuloTag]),
    MongooseModule.forFeature([
      { name: ArticuloDetalle.name, schema: ArticuloDetalleSchema },
      { name: Revision.name, schema: RevisionSchema }
    ]),
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
