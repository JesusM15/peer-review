import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateArticuloDto } from './create-articulo.dto';
import { IsEnum, IsOptional, IsArray, IsString } from 'class-validator';
import { EstadoArticulo } from '../entities/articulo.entity';

export class UpdateArticuloDto extends PartialType(OmitType(CreateArticuloDto, ['keywords'] as const)) {
  @IsOptional()
  @IsEnum(EstadoArticulo)
  estado?: EstadoArticulo;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
