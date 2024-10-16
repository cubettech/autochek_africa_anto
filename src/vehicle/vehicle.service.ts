import { Injectable, NotFoundException, ConflictException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/sqlite/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehicleDto } from './dto/list-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {

  private readonly logger = new Logger(VehicleService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) { }

  async create(createVehicleDto: CreateVehicleDto) {
    const { vin } = createVehicleDto;

    // checks the vin already exist in DB
    const existingVehicle = await this.vehicleRepository.findOne({ where: { vin } });
    if (existingVehicle) {
      throw new ConflictException(`Vehicle with VIN ${vin} already exists`);
    }

    try {

      const vehicle = this.vehicleRepository.create(createVehicleDto);
      return await this.vehicleRepository.save(vehicle);
    } catch (error) {
      const errorMessage = `Error Saving vehicle`;
      this.logger.error(error);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(listVehicleDto: ListVehicleDto) {

    const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC', make, model, search } = listVehicleDto;

    try {
      // Create a query builder
      const query = this.vehicleRepository.createQueryBuilder('vehicle');

      // Apply filters if provided
      if (make) {
        query.andWhere('vehicle.make = :make', { make });
      }
      if (model) {
        query.andWhere('vehicle.model = :model', { model });
      }

      // Apply search if provided
      if (search) {
        query.andWhere(
          'vehicle.vin LIKE :search OR vehicle.make LIKE :search OR vehicle.model LIKE :search',
          { search: `%${search}%` },
        );
      }

      // Apply sorting
      query.orderBy(`vehicle.${sortBy}`, sortOrder);

      // // Apply pagination
      query.skip((page - 1) * limit).take(limit);

      // Execute query and get results
      const [result, totalCount] = await query.getManyAndCount();

      return {
        data: result,
        pagination: {
          itemsInPage: +limit,
          totalCount,
          page: +page,
          totalPages: Math.ceil(totalCount / limit),
        }
      };
    } catch (error) {
      const errorMessage = `Error on finding vehicles`;
      this.logger.error(error);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    const vehicle = await this.vehicleRepository.findOne({
      relations: ['valuations'],
      where: { id }
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle not found`);
    }
    return vehicle;

  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const { vin } = updateVehicleDto;
    const vehicle = await this.findOne(id);

    // checks the vin already exist in DB only when the vin is passed and it is different from DB
    if (vin && vin !== vehicle.vin) {
      const existingVehicle = await this.vehicleRepository.findOne({ where: { vin } });
      if (existingVehicle) {
        throw new ConflictException(`Vehicle with VIN ${vin} already exists`);
      }
    }

    try {
      // Update the vehicle with the new data
      Object.assign(vehicle, updateVehicleDto);

      return this.vehicleRepository.save(vehicle);
    } catch (error) {
      const errorMessage = `Error on Updating vehicle`;
      this.logger.error(error);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.vehicleRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Vehicle not found`);
      }
    } catch (error) {
      const errorMessage = `Error on removing vehicle`;
      this.logger.error(error);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

  }
}
