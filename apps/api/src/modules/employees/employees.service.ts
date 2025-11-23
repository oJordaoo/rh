import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeesRepository } from './employees.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async create(dto: CreateEmployeeDto) {
    const existing = await this.employeesRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Employee with this email already exists');
    }
    return this.employeesRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      position: dto.position,
      department: dto.department,
    });
  }

  findAll() {
    return this.employeesRepository.findAll();
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.employeesRepository.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (dto.email && dto.email.toLowerCase() !== employee.email.toLowerCase()) {
      const conflict = await this.employeesRepository.findByEmail(dto.email);
      if (conflict) {
        throw new BadRequestException('Employee with this email already exists');
      }
    }

    const updated = await this.employeesRepository.update(id, {
      ...dto,
      email: dto.email?.toLowerCase(),
    });
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.employeesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Employee not found');
    }
    return { success: true };
  }
}
