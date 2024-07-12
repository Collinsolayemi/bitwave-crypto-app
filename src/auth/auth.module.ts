import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { OtpService } from 'src/common/services/otp/otp.service';
import { CoinbaseService } from 'src/common/services/coinbase/coinbase.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UserService, OtpService, CoinbaseService],
})
export class AuthModule {}
