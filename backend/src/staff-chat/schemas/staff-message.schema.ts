import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StaffMessageDocument = StaffMessage & Document;

@Schema({ timestamps: true })
export class StaffMessage {
  @Prop({ required: true })
  congreso_id: string;

  @Prop({ required: true })
  sender_id: string;

  @Prop({ required: true })
  sender_name: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  readBy: string[];
}

export const StaffMessageSchema = SchemaFactory.createForClass(StaffMessage);
