import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}
