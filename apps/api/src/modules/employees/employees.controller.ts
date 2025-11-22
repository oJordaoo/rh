import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles('ADMIN', 'HR')
  create(@Body() dto: any) {
    return this.employeesService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'HR')
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'HR', 'MANAGER')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }
}
