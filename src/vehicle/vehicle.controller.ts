import { Controller, Get, Post, Body, Patch, Param, Query, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { ValuationService } from './valuation.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehicleDto } from './dto/list-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { success, paginationResponse } from '../helpers/common-responses';

@ApiTags('Vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly valuationService: ValuationService
  ) {}

  @ApiOperation({ summary: 'Create new vehicle' })
  @Post()
  @ApiBody({ type: CreateVehicleDto })
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    const result = await this.vehicleService.create(createVehicleDto);
    return success(
      HttpStatus.CREATED,
      'Vehicle has been added',
      result
    );
  }

  @ApiOperation({ summary: 'Get all the vehicles' })
  @Get()
  async findAllVehicles(@Query() listVehicleDto: ListVehicleDto) {
    const {
      data,
      pagination
    } =  await this.vehicleService.findAll(listVehicleDto);
    return paginationResponse(
      HttpStatus.OK,
      data,
      pagination
    )
  }

  @ApiOperation({ summary: 'Get details of a single vehicle' })
  @Get(':id')
  async findVehicle(@Param('id') id: string) {
    const result = await this.vehicleService.findOne(+id);
    return success(
      HttpStatus.OK,
      'Success',
      result
    );
  }

  @ApiOperation({ summary: 'Update an existing vehicle details' })
  @Patch(':id')
  async updateVehicle(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    const result = await this.vehicleService.update(+id, updateVehicleDto);

    return success(
      HttpStatus.OK,
      'Vehicle has been updated',
      result
    );
  }

  @ApiOperation({ summary: 'Remove a vehicle' })
  @Delete(':id')
  async removeVehicle(@Param('id') id: string) {
    await this.vehicleService.remove(+id);

    return success(
      HttpStatus.OK,
      'Vehicle has been removed',
    );
  }

  @ApiOperation({ summary: 'Get the vehicle valuvation based on Vehicle id' })
  @Get('valuation/:id')
  async getVehicleValuation(@Param('id') id: string) {
    const result = await this.valuationService.getVehicleValuation(+id);
    return success(
      HttpStatus.OK,
      'Success',
      result
    );
  }
}
