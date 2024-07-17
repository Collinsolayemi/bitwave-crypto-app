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

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  secretRecovery: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  myTransactions: Transaction[];

  @Column({ nullable: true })
  walletId: string;
}
function EncryptedColumn(arg0: {
  type: string;
  length: number;
  nullable: boolean;
  encryptionOptions: {
    key: string; // Use a secure key management system
    algorithm: string; // Choose your algorithm
    ivLength: number;
  };
}): (target: User, propertyKey: 'secretRecovery') => void {
  throw new Error('Function not implemented.');
}
