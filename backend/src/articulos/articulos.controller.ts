import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { EstadoArticulo } from './entities/articulo.entity';
import { storageConfig, pdfFileFilter } from '../config/multer.config';

@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('pdf', {
    storage: storageConfig,
    fileFilter: pdfFileFilter,
  }))
  create(
    @Body() createArticuloDto: CreateArticuloDto,
    @UploadedFile() pdf?: any,
  ) {
    // Parse keywords from string if needed
    let keywords: string[] = [];
    const rawKeywords = (createArticuloDto as any).keywords;
    if (typeof rawKeywords === 'string') {
      try {
        keywords = JSON.parse(rawKeywords);
      } catch {
        keywords = [];
      }
    } else if (Array.isArray(rawKeywords)) {
      keywords = rawKeywords;
    }
    
    const pdfUrl = pdf ? `/uploads/pdfs/${pdf.filename}` : '';
    
    return this.articulosService.create({
      id: createArticuloDto.id,
      titulo: createArticuloDto.titulo,
      autor_id: createArticuloDto.autor_id,
      pdf_url: pdfUrl,
      keywords: keywords,
    });
  }

  @Get()
  findAll(
    @Query('autor_id') autor_id?: string,
    @Query('estado') estado?: EstadoArticulo,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    return this.articulosService.findAll({ autor_id, estado, include_relations: include });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include_relations') includeRelations?: string,
  ) {
    const include = includeRelations === 'true';
    return this.articulosService.findOne(id, include);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto) {
    return this.articulosService.update(id, updateArticuloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articulosService.remove(id);
  }
}
