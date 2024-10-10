import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from '../entities/sqlite/loan.entity'; // Import your Loan entity
import { VehicleService } from '../vehicle/vehicle.service'; // Import the VehicleService
import { Repository } from 'typeorm';

describe('LoanService', () => {
  let service: LoanService;
  let loanRepository: Repository<Loan>;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(Loan),  // This ensures the LoanRepository is injected
          useClass: Repository,  // Mocking the TypeORM repository for Loan
        },
        {
          provide: VehicleService,  // Mocking VehicleService
          useValue: {
            findOne: jest.fn(),  // You can add mock implementations as needed
          },
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
    loanRepository = module.get<Repository<Loan>>(getRepositoryToken(Loan));
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional test cases can go here
});
