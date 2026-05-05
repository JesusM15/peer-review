import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateArticuloDto {
  @IsString()
  id: string;

  @IsString()
  titulo: string;

  @IsString()
  autor_id: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  congreso_id?: string;
}
