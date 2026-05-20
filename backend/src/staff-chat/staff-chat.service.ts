import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StaffMessage, StaffMessageDocument } from './schemas/staff-message.schema';

@Injectable()
export class StaffChatService {
  constructor(@InjectModel(StaffMessage.name) private staffModel: Model<StaffMessageDocument>) {}

  async saveMessage(data: Partial<StaffMessage>) {
    const doc = new this.staffModel(data);
    return doc.save();
  }

  async getHistory(congresoId: string, limit = 50, before?: string) {
    const query: any = { congreso_id: congresoId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    const docs = await this.staffModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    return docs;
  }
}
