import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Rol } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}
