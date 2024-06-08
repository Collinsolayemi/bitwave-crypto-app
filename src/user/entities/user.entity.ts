import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
