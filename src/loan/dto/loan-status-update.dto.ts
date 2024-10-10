// src/loan/dto/update-loan-status.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LoanStatus } from '../../enums/loan-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLoanStatusDto {
    @ApiProperty({ description: 'new loan status', example: LoanStatus.APPROVED })
    @IsNotEmpty()
    @IsEnum(LoanStatus)
    status: LoanStatus;
}
