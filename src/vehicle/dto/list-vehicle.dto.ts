import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrderEnum } from '../../enums/sort-order.enum';

export enum VehicleSortBy {
    MAKE = 'make',
    MODEL = 'model',
    YEAR = 'year',
    MILEAGE = 'mileage',
}

export class ListVehicleDto {
    @ApiPropertyOptional({ description: 'Page no. want to access' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'No. of entries in a page'})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
   
    @ApiPropertyOptional({ description: 'Sort by field', enum: VehicleSortBy })
    @IsOptional()
    @IsEnum(VehicleSortBy)
    sortBy?: VehicleSortBy;

    @ApiPropertyOptional({ description: 'Sort order', enum: SortOrderEnum })
    @IsOptional()
    @IsEnum(SortOrderEnum)
    sortOrder?: 'ASC' | 'DESC';

    @ApiPropertyOptional({ description: 'Filter by make'})
    @IsOptional()
    @IsString()
    make?: string;

    @ApiPropertyOptional({ description: 'Filter by model'})
    @IsOptional()
    @IsString()
    model?: string;

    // For generic search 
    @ApiPropertyOptional({ description: 'Generic search like `vin`,`make` and `model`'})
    @IsOptional()
    @IsString()
    search?: string;
}
