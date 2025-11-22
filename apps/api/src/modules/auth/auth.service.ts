import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersRepository: UsersRepository) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersRepository.create(dto);
    const tokens = await this.issueTokens(user);
    return { user: this.exposeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(user);
    return { user: this.exposeUser(user), ...tokens };
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'peopleos-refresh',
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findById(payload.sub);
    if (!user || user.refreshToken !== dto.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.issueTokens(user);
    return { user: this.exposeUser(user), ...tokens };
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.usersRepository.findById(userId);
    return user || null;
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, name: user.name, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'peopleos-refresh',
      expiresIn: '7d',
    });
    await this.usersRepository.saveRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  private exposeUser(user: User) {
    return { id: user.id, name: user.name, email: user.email, roles: user.roles };
  }
}
