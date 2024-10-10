import { Controller, Post, Patch, Get, Query, Body, Param, HttpStatus } from '@nestjs/common';
import { LoanService } from './loan.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoanApplicationDto } from './dto/loan-application.dto';
import { ListLoanDto } from './dto/loan-listing.dto';
import { UpdateLoanStatusDto } from './dto/loan-status-update.dto';
import { success, paginationResponse } from '../helpers/common-responses';

@ApiTags('Loan')
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @ApiOperation({ summary: 'Submit a new loan application' })
  @Post('apply')
  async createLoan(@Body() loanApplicationDto: LoanApplicationDto) {
    const result = await this.loanService.create(loanApplicationDto);
    return success(
      HttpStatus.CREATED,
      'Loan application has been created',
      result
    );
  }

  @ApiOperation({
    summary: 'Get all loan applications',
  })
  @Get()
  async findAllLoanApplications(@Query() listLoanDto: ListLoanDto) {
    const {
      data,
      pagination
    } =  await this.loanService.findAll(listLoanDto);
    return paginationResponse(
      HttpStatus.OK,
      data,
      pagination
    )
  }

  @ApiOperation({
    summary: 'Get details of a single loan application',
  })
  @Get(':id')
  async findVehicle(@Param('id') id: string) {
    const result = await this.loanService.findOne(+id);
    return success(
      HttpStatus.OK,
      'Success',
      result
    );
  }

  @ApiOperation({summary: 'Update loan status'})
  @Patch(':id')
  async updateLoanStatus(@Param('id') id: string, @Body() updateLoanStatusDto: UpdateLoanStatusDto) {
    const result = await this.loanService.updateStatus(+id, updateLoanStatusDto);

    return success(
      HttpStatus.OK,
      'Loan status has been updated',
      result
    );
  }
}
