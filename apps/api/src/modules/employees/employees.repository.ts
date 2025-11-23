import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../../database/database.service';
import { Employee } from './interfaces/employee.interface';

@Injectable()
export class EmployeesRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(data: Omit<Employee, 'id'>) {
    const employee: Employee = { id: uuid(), ...data };
    this.database.getEmployees().push(employee);
    return employee;
  }

  async findAll() {
    return [...this.database.getEmployees()];
  }

  async findById(id: string) {
    return this.database.getEmployees().find((employee) => employee.id === id);
  }

  async findByEmail(email: string) {
    return this.database.getEmployees().find((employee) => employee.email.toLowerCase() === email.toLowerCase());
  }

  async update(id: string, data: Partial<Employee>) {
    const employees = this.database.getEmployees();
    const index = employees.findIndex((employee) => employee.id === id);
    if (index === -1) {
      return undefined;
    }
    employees[index] = { ...employees[index], ...data };
    return employees[index];
  }

  async delete(id: string) {
    const employees = this.database.getEmployees();
    const index = employees.findIndex((employee) => employee.id === id);
    if (index === -1) {
      return false;
    }
    employees.splice(index, 1);
    return true;
  }
}
