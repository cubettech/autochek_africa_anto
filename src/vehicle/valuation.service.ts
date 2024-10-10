// src/vehicles/valuation.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VehicleService } from './vehicle.service';
import { Valuation } from '../entities/sqlite/valuation.entity';

@Injectable()
export class ValuationService {
    private readonly logger = new Logger(ValuationService.name);
    private readonly RAPID_API_URL: string;
    private readonly RAPID_API_HOST: string;
    private readonly RAPID_API_KEY: string;

    constructor(
        @InjectRepository(Valuation)
        private readonly valuationRepository: Repository<Valuation>,
        private readonly configService: ConfigService,
        private readonly vehicleService: VehicleService,
    ) {
        this.RAPID_API_URL = this.configService.get<string>('RAPID_API_URL');
        this.RAPID_API_HOST = this.configService.get<string>('RAPID_API_HOST');
        this.RAPID_API_KEY = this.configService.get<string>('RAPID_API_KEY');
    }


    async getVehicleValuation(id: number): Promise<any> {

        // Check if API_URL is set
        if (!this.RAPID_API_URL || !this.RAPID_API_HOST || !this.RAPID_API_KEY) {
            const errorMessage = `Rapid API details is not configured`;
            this.logger.error(errorMessage);
            throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Get the vehicle details
        const vehicle = await this.vehicleService.findOne(id);
        const { vin } = vehicle;

        try {

            // call the rapid api for getting the valuation
            const response = await axios.get(this.RAPID_API_URL, {
                params: { vin },
                headers: {
                    'x-rapidapi-host': this.RAPID_API_HOST,
                    'x-rapidapi-key': this.RAPID_API_KEY,
                },
            });


            // save the details to the valuation table
            if( response &&  response.data ) { 
                const valuation = {
                    vehicle,
                    estimatedValue: response.data?.retail_value || 0
                }
                await this.saveValuation(valuation);
            }

            return {
                vehicle,
                valuation: response.data
            }; // Return the data received from the API
        } catch (error) {
            const errorMessage = `Error fetching vehicle valuation`;
            this.logger.error(error);
            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    async saveValuation(valuation: Partial<Valuation>) {
        const vehicle = this.valuationRepository.create(valuation);
        return await this.valuationRepository.save(vehicle);
    }
}
