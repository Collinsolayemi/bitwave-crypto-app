import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  password: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiration: Date;
}
