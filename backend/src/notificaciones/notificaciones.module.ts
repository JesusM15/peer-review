import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { PushSubscription } from './entities/push-subscription.entity';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { PushService } from './push.service';
import { User } from '../users/entities/user.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion, PushSubscription, User, Asignacion]),
  ],
  providers: [NotificacionesService, PushService],
  controllers: [NotificacionesController],
  exports: [NotificacionesService, PushService],
})
export class NotificacionesModule {}
