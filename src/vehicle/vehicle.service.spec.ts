import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from '../entities/sqlite/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepository: Repository<Vehicle>;

  const mockVehicleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehicleRepository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  describe('create', () => {
    it('should insert vehicle data to the DB', async () => {
      const vehicleData = {
        vin: '1HGCM82633A123456',
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        mileage: 10000,
      };

      // Mock the repository methods
      mockVehicleRepository.findOne.mockResolvedValue(undefined); // No existing vehicle
      mockVehicleRepository.create.mockReturnValue(vehicleData);
      mockVehicleRepository.save.mockResolvedValue(vehicleData);

      const result = await service.create(vehicleData);

      expect(mockVehicleRepository.findOne).toHaveBeenCalledWith({ where: { vin: vehicleData.vin } });
      expect(mockVehicleRepository.create).toHaveBeenCalledWith(vehicleData);
      expect(mockVehicleRepository.save).toHaveBeenCalledWith(vehicleData);
      expect(result).toEqual(vehicleData);
    });

    it('should throw an error if the vehicle VIN already exists', async () => {
      const  vin = '1HGCM82633A123456';
      const createVehicleDto: CreateVehicleDto = {
        vin: '1HGCM82633A123456',
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        mileage: 10000,
      };

      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(createVehicleDto as Vehicle);

      await expect(service.create(createVehicleDto)).rejects.toThrow(`Vehicle with VIN ${vin} already exists`);
    });
  });
});
