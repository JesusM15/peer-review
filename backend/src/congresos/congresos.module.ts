import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CongresosController } from './congresos.controller';
import { CongresosService } from './congresos.service';
import { Congreso } from './entities/congreso.entity';
import { Tag } from './entities/tag.entity';
import { UsuarioCongresoRol } from './entities/usuario-congreso-rol.entity';
import { EditorTag } from './entities/editor-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Congreso, Tag, UsuarioCongresoRol, EditorTag]),
  ],
  controllers: [CongresosController],
  providers: [CongresosService],
  exports: [CongresosService],
})
export class CongresosModule {}
