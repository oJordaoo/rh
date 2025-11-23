import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { User } from '../modules/auth/interfaces/user.interface';
import { Employee } from '../modules/employees/interfaces/employee.interface';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private users: User[] = [];
  private employees: Employee[] = [];

  onModuleInit() {
    this.seed();
  }

  getUsers() {
    return this.users;
  }

  getEmployees() {
    return this.employees;
  }

  reset() {
    this.users = [];
    this.employees = [];
    this.seed();
  }

  private seed() {
    if (!this.users.find((user) => user.email === 'admin@peopleos.com')) {
      const passwordHash = bcrypt.hashSync('admin123', 10);
      this.users.push({
        id: uuid(),
        name: 'Admin',
        email: 'admin@peopleos.com',
        passwordHash,
        roles: ['ADMIN'],
        refreshToken: undefined,
      });
    }

    if (this.employees.length === 0) {
      this.employees.push(
        {
          id: uuid(),
          name: 'Alice Souza',
          email: 'alice@peopleos.com',
          position: 'HR Analyst',
          department: 'People',
        },
        {
          id: uuid(),
          name: 'Bruno Lima',
          email: 'bruno@peopleos.com',
          position: 'Engineering Manager',
          department: 'Engineering',
        },
      );
    }
  }
}
