import { ApiProperty } from '../../../stubs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'maria@peopleos.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Product Manager', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  position?: string;

  @ApiProperty({ example: 'Product', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  department?: string;
}
