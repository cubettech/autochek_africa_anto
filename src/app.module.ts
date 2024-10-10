import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Vehicle } from './entities/sqlite/vehicle.entity';
import { Valuation } from './entities/sqlite/valuation.entity';
import { Loan } from './entities/sqlite/loan.entity';
import { VehicleModule } from './vehicle/vehicle.module';
import { LoanModule } from './loan/loan.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Make config globally available
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // In-memory SQLite database
      entities: [
        Vehicle,
        Valuation,
        Loan
      ],
      synchronize: true, // Automatically syncs entities with database
    }),
    VehicleModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
