
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { LoanStatus } from '../../enums/loan-status.enum';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  applicantName: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column()
  income: number;

  @Column()
  isEmployed: boolean;

  @Column({ nullable: true })
  creditScore: number;

  @ManyToOne(() => Vehicle, vehicle => vehicle.loans)
  vehicle: Vehicle;

  @Column({
    type: 'int',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status: LoanStatus;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date
}
