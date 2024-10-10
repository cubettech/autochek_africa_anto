import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Valuation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @Column()
  estimatedValue: number;

  @CreateDateColumn({ type: 'datetime' })
  valuationDate: Date;
}
