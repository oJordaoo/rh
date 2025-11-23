import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { User } from '../interfaces/user.interface';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(data: { name: string; email: string; password: string; roles?: string[] }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user: User = {
      id: uuid(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      roles: data.roles?.length ? data.roles : ['EMPLOYEE'],
    };
    this.database.getUsers().push(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.database.getUsers().find((user) => user.email === email.toLowerCase());
  }

  async findById(id: string) {
    return this.database.getUsers().find((user) => user.id === id);
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    const user = await this.findById(userId);
    if (user) {
      user.refreshToken = refreshToken;
    }
    return user;
  }
}
