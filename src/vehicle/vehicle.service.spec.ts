import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from '../entities/sqlite/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

describe('VehicleService', () => {
  let service: VehicleService;
  let repository: Repository<Vehicle>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle), // This ensures the VehicleRepository is injected
          useClass: Repository, // Mocking the TypeORM repository for Vehicle
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    repository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVehicle', () => {
    it('should create a new vehicle successfully', async () => {
      const createVehicleDto: CreateVehicleDto = { vin: '1HGCM82633A123456', make: 'Honda', model: 'Accord', year: 2022, mileage: 10 };

      jest.spyOn(repository, 'save').mockResolvedValue(createVehicleDto as Vehicle);

      const result = await service.create(createVehicleDto);

      expect(result).toEqual(createVehicleDto);
      expect(repository.save).toHaveBeenCalledWith(createVehicleDto);
    });

    it('should throw an error if the vehicle VIN already exists', async () => {
      const  vin = '1HGCM82633A123456';
      const createVehicleDto: CreateVehicleDto = {vin, make: 'Honda', model: 'Accord', year: 2022, mileage: 10 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(createVehicleDto as Vehicle);

      await expect(service.create(createVehicleDto)).rejects.toThrow(`Vehicle with VIN ${vin} already exists`);
    });
  });
});
