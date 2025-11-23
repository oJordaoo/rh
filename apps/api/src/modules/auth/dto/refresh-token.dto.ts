import { ApiProperty } from '../../../stubs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token emitido em /auth/login ou /auth/refresh' })
  @IsString()
  refreshToken!: string;
}
