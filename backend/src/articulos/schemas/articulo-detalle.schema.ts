import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticuloDetalleDocument = HydratedDocument<ArticuloDetalle>;

@Schema({ _id: false, versionKey: false })
export class ArticuloDetalle {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String })
  pdf_url: string;

  @Prop({ type: [Number] })
  embeddings: number[];

  @Prop({ type: [String] })
  keywords: string[];
}

export const ArticuloDetalleSchema = SchemaFactory.createForClass(ArticuloDetalle);
