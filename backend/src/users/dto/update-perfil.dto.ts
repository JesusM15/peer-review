import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdatePerfilDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  carrera?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  especialidades?: string[];
}
