import { ApiPropertyOptional } from '../../../stubs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: 'Maria Silva' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'maria@peopleos.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Product Manager' })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  position?: string;

  @ApiPropertyOptional({ example: 'Product' })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  department?: string;
}
