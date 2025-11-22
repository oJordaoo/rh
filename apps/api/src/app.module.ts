import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './modules/employees/employees.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, EmployeesModule],
})
export class AppModule {}
