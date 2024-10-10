import { IsString, IsInt, Length, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
    @ApiProperty({ description: 'Vehicle identification no.', example: '5FRYD4H66GB592800'})
    @IsNotEmpty()
    @IsString()
    @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
    vin: string;

    @ApiProperty({ description: 'Vehicle make', example: 'Toyota'})
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    make: string;

    @ApiProperty({ description: 'Vehicle model', example: 'Prado'})
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    model: string;

    @ApiProperty({ description: 'Vehicle year of manufature', example: '2024'})
    @IsInt()
    @Min(1886) 
    @Max(new Date().getFullYear())  // Max year is the current year
    year: number;

    @ApiProperty({ description: 'Vehicle milage in Kilo Meter Per Liter', example: '10'})
    @IsInt()
    @Min(0)
    @Max(1000)
    mileage: number;
}