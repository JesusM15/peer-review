import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, Res, NotFoundException, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { EstadoArticulo } from './entities/articulo.entity';
import { storageConfig, pdfFileFilter } from '../config/multer.config';
import * as fs from 'fs';
import * as path from 'path';

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

  @Get(':id/download')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    console.log(`[Download] Solicitando PDF para articulo: ${id}`);
    
    const articulo = await this.articulosService.findOne(id, false);
    
    console.log(`[Download] Articulo encontrado:`, articulo?.id, 'pdf_url:', articulo?.pdf_url);
    
    if (!articulo || !articulo.pdf_url) {
      throw new NotFoundException('Artículo o PDF no encontrado');
    }

    const uploadsDir = process.env.UPLOADS_DIR || './uploads/pdfs';
    const pdfPath = path.join(uploadsDir, path.basename(articulo.pdf_url));
    
    console.log(`[Download] Buscando archivo en: ${pdfPath}`);
    console.log(`[Download] Directorio actual: ${process.cwd()}`);
    console.log(`[Download] ¿Existe uploadsDir?: ${fs.existsSync(uploadsDir)}`);

    if (!fs.existsSync(pdfPath)) {
      console.log(`[Download] ❌ Archivo no encontrado: ${pdfPath}`);
      throw new NotFoundException('Archivo PDF no encontrado en el servidor');
    }
    
    console.log(`[Download] ✅ Archivo encontrado, enviando...`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${articulo.titulo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  }
}
