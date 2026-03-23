import { PartialType } from '@nestjs/mapped-types';
import { CreateArticuloDto } from './create-articulo.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoArticulo } from '../entities/articulo.entity';

export class UpdateArticuloDto extends PartialType(CreateArticuloDto) {
  @IsOptional()
  @IsEnum(EstadoArticulo)
  estado?: EstadoArticulo;
}
