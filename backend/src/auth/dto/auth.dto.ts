import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../schemas/user.schema.js';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
