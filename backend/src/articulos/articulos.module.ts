import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { Articulo } from './entities/articulo.entity';
import { ArticuloDetalle, ArticuloDetalleSchema } from './schemas/articulo-detalle.schema';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';
import { AsignacionesModule } from '../asignaciones/asignaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articulo]),
    MongooseModule.forFeature([{ name: ArticuloDetalle.name, schema: ArticuloDetalleSchema }]),
    AsignacionesModule,
  ],
  controllers: [ArticulosController],
  providers: [ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
