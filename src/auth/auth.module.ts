import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { OtpService } from 'src/common/services/otp/otp.service';
import { BlockCypherService } from 'src/common/services/blockcypher/blockcypher.service';
import { Wallet } from 'src/user/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet])],
  controllers: [AuthController],
  providers: [AuthService, UserService, OtpService, BlockCypherService],
})
export class AuthModule {}
