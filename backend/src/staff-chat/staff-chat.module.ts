import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StaffChatService } from './staff-chat.service';
import { StaffChatGateway } from './staff-chat.gateway';
import {
  StaffMessage,
  StaffMessageSchema,
} from './schemas/staff-message.schema';
import { StaffChatController } from './staff-chat.controller';
import { CongresosModule } from '../congresos/congresos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StaffMessage.name, schema: StaffMessageSchema },
    ]),
    CongresosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [StaffChatService, StaffChatGateway],
  controllers: [StaffChatController],
  exports: [StaffChatService],
})
export class StaffChatModule {}
