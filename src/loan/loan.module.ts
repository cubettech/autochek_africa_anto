import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { Loan } from '../entities/sqlite/loan.entity';
import { Vehicle } from '../entities/sqlite/vehicle.entity';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan,Vehicle]),
    VehicleModule
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
