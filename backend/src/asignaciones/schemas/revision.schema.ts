import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RevisionDocument = HydratedDocument<Revision>;

@Schema({ _id: false, versionKey: false })
export class Revision {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  articulo_id: string;

  @Prop({ type: String, required: true })
  revisor_id: string;

  @Prop({ type: String, required: true })
  decision: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  comentarios: any;

  @Prop({ type: Date, default: Date.now })
  fecha_revision: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  secciones: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  analisis_ia: any;
}

export const RevisionSchema = SchemaFactory.createForClass(Revision);
