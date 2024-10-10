import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrderEnum } from '../../enums/sort-order.enum';

export enum LoanListSortBy {
    APPLICANT_NAME = 'applicantName',
}

export class ListLoanDto {
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
   
    @ApiPropertyOptional({ description: 'Sort by field', enum: LoanListSortBy })
    @IsOptional()
    @IsEnum(LoanListSortBy)
    sortBy?: LoanListSortBy;

    @ApiPropertyOptional({ description: 'Sort order', enum: SortOrderEnum })
    @IsOptional()
    @IsEnum(SortOrderEnum)
    sortOrder?: 'ASC' | 'DESC';
}
