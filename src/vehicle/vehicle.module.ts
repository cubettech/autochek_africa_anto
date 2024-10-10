import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicle.service';
import { ValuationService } from './valuation.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle } from '../entities/sqlite/vehicle.entity';
import { Valuation } from '../entities/sqlite/valuation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle,Valuation])],
  controllers: [VehicleController],
  providers: [VehicleService, ValuationService],
  exports: [VehicleService]
})
export class VehicleModule { }
