import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from '../entities/sqlite/loan.entity'; // Import your Loan entity
import { Repository } from 'typeorm';
import { VehicleService } from '../vehicle/vehicle.service'; // Import your VehicleService

describe('LoanService', () => {
  let service: LoanService;
  let loanRepository: Repository<Loan>;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(Loan),  // Inject LoanRepository using getRepositoryToken
          useClass: Repository,  // Mocking the TypeORM repository
        },
        {
          provide: VehicleService,  // Mock VehicleService
          useValue: {
            findOne: jest.fn(),  // Mock implementation for VehicleService methods
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

  // Additional test cases go here
});
