import { ApiProperty } from '../../../stubs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Novo Usuário' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'user@peopleos.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 6, example: 'senhaSegura' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ required: false, example: ['EMPLOYEE'] })
  @IsArray()
  @IsOptional()
  roles?: string[];
}
