// src/loan/dto/create-loan-application.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, Min, Max, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoanApplicationDto {
    @ApiProperty({ description: 'Applicant name', example: 'Anto Abraham' })
    @IsNotEmpty()
    applicantName: string;

    @ApiProperty({ description: 'Applicant name', example: 'test@cubettech.com' })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email address' })  // Validate email
    email: string;

    @ApiProperty({ description: 'Applicant age', example: '30' })
    @IsNotEmpty()
    @IsNumber()
    @Min(18)
    @Max(90)
    age: number;

    @ApiProperty({ description: 'Applicant yearly income', example: '100000' })
    @IsNotEmpty()
    @IsNumber()
    income: number;

    @ApiProperty({ description: 'Employed or not', example: true })
    @IsNotEmpty()
    isEmployed: boolean;

    @ApiProperty({ description: 'Applicant credit score', example: '800' })
    @IsOptional()
    @Min(100)
    @Max(1000)
    @IsNumber()
    creditScore?: number;

    @ApiProperty({ description: 'Vehicle Id for availaing the loan', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    vehicleId: number;
}
