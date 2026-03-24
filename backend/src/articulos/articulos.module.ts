import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MongooseModule } from '@nestjs/mongoose';

import { Articulo } from './entities/articulo.entity';

import { ArticuloDetalle, ArticuloDetalleSchema } from './schemas/articulo-detalle.schema';

import { ArticulosService } from './articulos.service';



@Module({

  imports: [

    TypeOrmModule.forFeature([Articulo]),

    MongooseModule.forFeature([{ name: ArticuloDetalle.name, schema: ArticuloDetalleSchema }]),

  ],

  providers: [ArticulosService],

  exports: [ArticulosService],

})

export class ArticulosModule {}

