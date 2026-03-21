import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Articulo, EstadoArticulo } from './entities/articulo.entity';
import { ArticuloDetalle, ArticuloDetalleDocument } from './schemas/articulo-detalle.schema';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectModel(ArticuloDetalle.name)
    private readonly articuloDetalleModel: Model<ArticuloDetalleDocument>,
  ) {}

  async createArticulo(data: {
    id: string;
    titulo: string;
    autor_id: string;
    pdf_url?: string;
    keywords?: string[];
  }) {
    // 1. Doble Inserción: Usar el UUID de cliente (Offline-First)
    const { id, titulo, autor_id, pdf_url, keywords } = data;

    // Crear modelo relacional
    const nuevoArticulo = this.articuloRepository.create({
      id,
      titulo,
      autor_id,
      estado: EstadoArticulo.BORRADOR,
    });

    try {
      // Guardar en MariaDB (TypeORM)
      await this.articuloRepository.save(nuevoArticulo);

      // 2. Crear documento no-relacional manteniendo el mismo UUID
      const nuevoDetalle = new this.articuloDetalleModel({
        _id: id,
        pdf_url: pdf_url || '',
        embeddings: [],
        keywords: keywords || [],
      });
      
      // Guardar en MongoDB (Mongoose)
      await nuevoDetalle.save();

      return {
        articulo: nuevoArticulo,
        detalle: nuevoDetalle,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al realizar la doble inserción en MariaDB y MongoDB',
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
