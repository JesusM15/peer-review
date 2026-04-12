import { IsString, IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Rol } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(Rol)
  @IsNotEmpty()
  rol: Rol;
}
