import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  private: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  public: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  wif: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  addressId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
