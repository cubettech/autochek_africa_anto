import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleService } from './vehicle.service';
import { Vehicle } from '../entities/sqlite/vehicle.entity'; // Import your Vehicle entity
import { Repository } from 'typeorm';

describe('VehicleService', () => {
  let service: VehicleService;
  let repository: Repository<Vehicle>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),  // Injecting the VehicleRepository using getRepositoryToken
          useClass: Repository,  // Mocking TypeORM repository for Vehicle
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    repository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional test cases can go here
});
