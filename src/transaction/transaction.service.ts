import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(payload: CreateTransactionDto): Promise<Transaction> {
    const transactionRef = `transRefId-${nanoid(10)}`;

    const { amount, userId, additionalDetails } = payload;
    const transaction = this.transactionRepository.create({
      amount,
      transactionRef,
      user: { id: userId } as User,
      additionalDetails,
    });
    return await this.transactionRepository.save(transaction);
  }

  async addCrypto() {

  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
