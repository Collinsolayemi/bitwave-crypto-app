import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiration: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  displayName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  secretRecovery: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  myTransactions: Transaction[];
}
