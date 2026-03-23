import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Articulo, EstadoArticulo } from './entities/articulo.entity';
import { ArticuloDetalle, ArticuloDetalleDocument } from './schemas/articulo-detalle.schema';
import { Revision, RevisionDocument } from '../asignaciones/schemas/revision.schema';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectModel(ArticuloDetalle.name)
    private readonly articuloDetalleModel: Model<ArticuloDetalleDocument>,
    @InjectModel(Revision.name)
    private readonly revisionModel: Model<RevisionDocument>,
  ) {}

  async create(data: {
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

  async findAll(filters: { autor_id?: string; estado?: EstadoArticulo, include_relations?: boolean }) {
    const query = this.articuloRepository.createQueryBuilder('articulo');
    
    if (filters.include_relations) {
      query.leftJoinAndSelect('articulo.asignaciones', 'asignacion');
      query.leftJoinAndSelect('asignacion.revisor', 'revisor');
      query.leftJoinAndSelect('articulo.autor', 'autor');
    }

    if (filters.autor_id) {
      query.andWhere('articulo.autor_id = :autor', { autor: filters.autor_id });
    }
    
    if (filters.estado) {
      query.andWhere('articulo.estado = :estado', { estado: filters.estado });
    }

    const articulos = await query.getMany();
    
    if (articulos.length === 0) return [];

    const ids = articulos.map(a => a.id);
    const detalles = await this.articuloDetalleModel.find({ _id: { $in: ids } });
    
    let revisiones: RevisionDocument[] = [];
    if (filters.include_relations) {
      revisiones = await this.revisionModel.find({ articulo_id: { $in: ids } }).exec();
    }

    return articulos.map(articulo => {
      const detalle = detalles.find(d => d._id === articulo.id);
      
      const payload: any = {
        ...articulo,
        pdf_url: detalle?.pdf_url || '',
        keywords: detalle?.keywords || [],
      };

      if (filters.include_relations) { 
        payload.revisiones = revisiones.filter(r => r.articulo_id === articulo.id);
      }

      return payload;
    });
  }

  async findOne(id: string, include_relations: boolean = false) {
    const query = this.articuloRepository.createQueryBuilder('articulo')
      .where('articulo.id = :id', { id });

    if (include_relations) {
      query.leftJoinAndSelect('articulo.asignaciones', 'asignacion');
      query.leftJoinAndSelect('asignacion.revisor', 'revisor');
      query.leftJoinAndSelect('articulo.autor', 'autor');
    }

    const articulo = await query.getOne();
    
    if (!articulo) {
      throw new NotFoundException(`Articulo con ID ${id} no encontrado`);
    }

    const detalle = await this.articuloDetalleModel.findById(id).exec();
    
    let revisiones: RevisionDocument[] = [];
    if (include_relations) {
      revisiones = await this.revisionModel.find({ articulo_id: id }).exec();
    }

    const payload: any = {
      ...articulo,
      pdf_url: detalle?.pdf_url || '',
      keywords: detalle?.keywords || [],
      embeddings: detalle?.embeddings || [],
    };

    if (include_relations) {
      payload.revisiones = revisiones;
    }

    return payload;
  }

  async update(id: string, updateData: { titulo?: string; estado?: EstadoArticulo; pdf_url?: string; keywords?: string[] }) {
    const articulo = await this.articuloRepository.findOne({ where: { id } });
    
    if (!articulo) {
      throw new NotFoundException(`Articulo con ID ${id} no encontrado`);
    }

    const { titulo, estado, pdf_url, keywords } = updateData;
    let hasMariaUpdate = false;

    if (titulo !== undefined) {
      articulo.titulo = titulo;
      hasMariaUpdate = true;
    }
    
    if (estado !== undefined) {
      articulo.estado = estado;
      hasMariaUpdate = true;
    }

    if (hasMariaUpdate) {
      await this.articuloRepository.save(articulo);
    }

    let hasMongoUpdate = false;
    const mongoUpdate: any = {};
    
    if (pdf_url !== undefined) {
      mongoUpdate.pdf_url = pdf_url;
      hasMongoUpdate = true;
    }
    
    if (keywords !== undefined) {
      mongoUpdate.keywords = keywords;
      hasMongoUpdate = true;
    }

    let detalle: ArticuloDetalleDocument | null = null;
    if (hasMongoUpdate) {
      detalle = await this.articuloDetalleModel.findByIdAndUpdate(id, mongoUpdate, { new: true }).exec();
    } else {
      detalle = await this.articuloDetalleModel.findById(id).exec();
    }

    return {
      ...articulo,
      pdf_url: detalle?.pdf_url || '',
      keywords: detalle?.keywords || [],
    };
  }

  async remove(id: string) {
    const articulo = await this.articuloRepository.findOne({ where: { id } });
    
    if (!articulo) {
      throw new NotFoundException(`Articulo con ID ${id} no encontrado`);
    }

    try {
      await this.articuloRepository.delete(id);
      await this.articuloDetalleModel.findByIdAndDelete(id).exec();
      return { message: `Articulo con ID ${id} eliminado correctamente` };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el artículo', error instanceof Error ? error.message : String(error));
    }
  }
}
