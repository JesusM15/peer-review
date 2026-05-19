import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoSolicitudCongreso } from '../entities/solicitud-congreso.entity';

export class ResolveSolicitudCongresoDto {
  @IsEnum(EstadoSolicitudCongreso, {
    message: 'estado debe ser "Aprobado" o "Rechazado".',
  })
  estado: EstadoSolicitudCongreso;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  respuesta?: string;
}
