import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateArticuloDto {
  @IsUUID(4)
  id: string;

  @IsString()
  titulo: string;

  @IsUUID(4)
  autor_id: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
