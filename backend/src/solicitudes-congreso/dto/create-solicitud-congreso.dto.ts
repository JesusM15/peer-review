import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateSolicitudCongresoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  nombre_propuesto: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descripcion_propuesta?: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio_propuesta?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin_propuesta?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  motivo?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
