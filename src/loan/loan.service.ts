import { 
    Injectable, 
    NotFoundException, 
    ConflictException, 
    UnprocessableEntityException, 
    Logger, 
    HttpException, 
    HttpStatus 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../entities/sqlite/loan.entity';
import { Vehicle } from '../entities/sqlite/vehicle.entity';
import { LoanApplicationDto } from './dto/loan-application.dto';
import { UpdateLoanStatusDto } from './dto/loan-status-update.dto';
import { ListLoanDto } from './dto/loan-listing.dto';
import { LoanStatus } from '../enums/loan-status.enum';
import { VehicleService } from '../vehicle/vehicle.service';

@Injectable()
export class LoanService {

    private readonly logger = new Logger(LoanService.name);

    constructor(
        @InjectRepository(Loan)
        private readonly loanRepository: Repository<Loan>,
        private readonly vehicleService: VehicleService,
    ) { }

    async create(loanApplicationDto: LoanApplicationDto): Promise<Loan> {
        const { email, vehicleId } = loanApplicationDto;

        // Checks the vehicle is valid
        const vehicle = await this.vehicleService.findOne(vehicleId);

        // check that applicant already submit the loan application on the pending status
        // Here the duplication checking based on the applicatnt's email,vehicle and pending status
        const loanExist = await this.applicationExist(email, vehicle);
        if (loanExist) {
            throw new ConflictException(`Loan application for applicant with email ${email} already exist under process`);
        }

        // Here perfom some checking for the applicant's loan eligibility
        await this.loanEligibility(loanApplicationDto, vehicle);

        try {
            const loan = this.loanRepository.create(loanApplicationDto);
            loan.vehicle = vehicle; // assign vehicle reference
            return await this.loanRepository.save(loan);
        } catch (error) {
            const errorMessage = `Error on creating a loan application`;
            this.logger.error(error);
            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }

    }

    async findAll(listLoanDto: ListLoanDto) {
        const { page = 1, limit = 10, sortBy = 'id', sortOrder = 'ASC' } = listLoanDto;

        // Create a query builder
        const query = this.loanRepository.createQueryBuilder('loan')
            .leftJoin('loan.vehicle', 'vehicle')
            .addSelect(['vehicle.id', 'vehicle.make', 'vehicle.vin', 'vehicle.model']);

        // Apply sorting
        query.orderBy(`loan.${sortBy}`, sortOrder);

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
    }

    async findOne(id: number) {
        const loanApplication = await this.loanRepository.findOne({
            relations: ['vehicle'],
            where: { id }
        });
        if (!loanApplication) {
            throw new NotFoundException(`Loan application not found`);
        }
        return loanApplication;
    }

    async updateStatus(id: number, updateLoanStatusDto: UpdateLoanStatusDto): Promise<Loan> {
        const loan = await this.findOne(id);
        try {
            loan.status = updateLoanStatusDto.status;
            return await this.loanRepository.save(loan);
        } catch (error) {
            const errorMessage = `Error on update a loan application status`;
            this.logger.error(error);
            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
        
    }

    async applicationExist(email: string, vehicle: Partial<Vehicle>) {
        return await this.loanRepository.findOne({ where: { email, vehicle: vehicle.id as any, status: LoanStatus.PENDING } });
    }

    async loanEligibility(loanApplicationDto: LoanApplicationDto, vehicle: Partial<Vehicle>) {
        const { income, creditScore } = loanApplicationDto;
        if (income < 100000) { // if the income < 1 Lakh, not eligle for loan
            throw new UnprocessableEntityException(`Loan application not able to create as the applicant's income is not sufficient`);
        }

        if (creditScore < 650) { // if the credit score < 650 not eligle for loan
            throw new UnprocessableEntityException(`Loan application not able to create as the applicant's credit score is low`);
        }

        const currentYear = new Date().getFullYear();
        if (vehicle.year < currentYear - 10) { // if vehicle make year is less older than 10 year not eligible for loan
            throw new UnprocessableEntityException(`Loan application not able to create as the vehicle is old`);
        }
    }
}
