import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Valuation } from './valuation.entity';
import { Loan } from './loan.entity';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        length: 17
    })
    vin: string;

    @Column({
        length: 50
    })
    make: string;

    @Column({
        length: 50
    })
    model: string;

    @Column()
    year: number;

    @Column()
    mileage: number;

    @CreateDateColumn({ type: 'datetime' })
    createdDate: Date

    @OneToMany(() => Valuation, valuation => valuation.vehicle)
    valuations: Valuation[]; // Establishing the relationship

    @OneToMany(() => Loan, loan => loan.vehicle)
    loans: Loan[]; // Establishing the relationship
}