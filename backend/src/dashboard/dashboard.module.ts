import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Articulo } from '../articulos/entities/articulo.entity';
import { User } from '../users/entities/user.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo, User, Asignacion])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
