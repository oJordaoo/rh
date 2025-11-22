import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

interface Employee {
  id: string;
  name: string;
  email: string;
  position?: string;
}

@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];

  create(dto: Omit<Employee, 'id'>) {
    const employee: Employee = { id: uuid(), ...dto };
    this.employees.push(employee);
    return employee;
  }

  findAll() {
    return this.employees;
  }

  findOne(id: string) {
    return this.employees.find((employee) => employee.id === id);
  }
}
