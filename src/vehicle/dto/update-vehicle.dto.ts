import { IsString, IsInt, Length, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVehicleDto {
    @ApiPropertyOptional({ description: 'Vehicle identification no.', example: '5FRYD4H66GB592800'})
    @IsOptional()
    @IsString()
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    vin: string;

    @ApiPropertyOptional({ description: 'Vehicle make', example: 'Toyota'})
    @IsOptional()
    @IsString()
    @Length(2, 50)
    make: string;

    @ApiPropertyOptional({ description: 'Vehicle model', example: 'Prado'})
    @IsOptional()
    @IsString()
    @Length(2, 50)
    model: string;

    @ApiPropertyOptional({ description: 'Vehicle year of manufature', example: '2024'})
    @IsOptional()
    @IsInt()
    @Min(1886) 
    @Max(new Date().getFullYear())  // Max year is the current year
    year: number;

    @ApiPropertyOptional({ description: 'Vehicle milage in Kilo Meter Per Liter', example: '10'})
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1000)
    mileage: number;
}