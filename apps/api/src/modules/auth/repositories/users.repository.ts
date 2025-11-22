import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository {
  private users: User[] = [];

  constructor() {
    this.seedAdmin();
  }

  private seedAdmin() {
    const existingAdmin = this.users.find((user) => user.email === 'admin@peopleos.com');
    if (existingAdmin) return;
    const passwordHash = bcrypt.hashSync('admin123', 10);
    this.users.push({
      id: uuid(),
      name: 'Admin',
      email: 'admin@peopleos.com',
      passwordHash,
      roles: ['ADMIN'],
    });
  }

  async create(data: { name: string; email: string; password: string; roles?: string[] }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user: User = {
      id: uuid(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      roles: data.roles?.length ? data.roles : ['EMPLOYEE'],
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email.toLowerCase());
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const user = await this.findById(userId);
    if (user) {
      user.refreshToken = refreshToken;
    }
    return user;
  }
}
