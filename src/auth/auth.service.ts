import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/common/services/otp/otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto.js';
import * as jwt from 'jsonwebtoken';
import { ForgetPasswordDto } from './dto/forget-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { SecretRecoveryPhraseDto } from './dto/secre-recovery.dto.js';
import { ConfirmSecretRecoveryPhraseDto } from './dto/confirm-secret-recovery.dto.js';
import { SignupStep1Dto, SignupStep2Dto } from './dto/signup.dto.ts.js';
import { BlockCypherService } from 'src/common/services/blockcypher/blockcypher.service';
import { Wallet } from 'src/user/entities/wallet.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private userService: UserService,
    private otpService: OtpService,
    private blockCypherService: BlockCypherService,
  ) {}

  async signupStep1(signupDto: SignupStep1Dto) {
    const { email, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and set expiration time
    const otp = await this.otpService.generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    // Create the user with OTP and expiration time
    const user = await this.userService.create({
      email,
      password: hashedPassword,
      otp: hashedOtp,
    });

    await this.otpService.requestOtp({ email });

    return { user, statusCode: HttpStatus.OK };
  }

  async signUpStep2(signupDto: SignupStep2Dto) {
    const { email, country, displayName } = signupDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    user.country = country;
    user.displayName = displayName;

    //generate wallet address
    const walletData = await this.blockCypherService.generateAddress();

    const newWallet = this.walletRepository.create({
      private: walletData.private,
      public: walletData.public,
      wif: walletData.wif,
      addressId: walletData.address,
      user: user,
    });

    await this.walletRepository.save(newWallet);

    await this.userRepository.save(user);

    return { newWallet, statusCode: HttpStatus.OK };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect email or password');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    return {
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      statusCode: HttpStatus.OK,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!existingUser) {
      throw new BadRequestException('Email already in use');
    }
    await this.otpService.requestOtp({ email });

    return {
      message: 'OTP has been sent to your email for password reset',
      statusCode: HttpStatus.OK,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, confirmPassword } = resetPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return {
      statusCode: 200,
      message: 'Password reset successfully',
    };
  }

  async updateSecreRecoveryPhrase(
    secretRecoveryPhrase: SecretRecoveryPhraseDto,
  ) {
    const { email, secretRecovery } = secretRecoveryPhrase;

    if (secretRecovery.length !== 12) {
      throw new BadRequestException(
        'The recovery phrase must contain exactly 12 words.',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const joinedSecretRecovery = secretRecovery.join(' ');
    const hashedSecretPhrase = await bcrypt.hash(joinedSecretRecovery, 10);

    user.secretRecovery = hashedSecretPhrase;
    await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'Secret recovery phrase updated successfully',
    };
  }

  async confirmSecretRecoveryPhrase(
    confirmSecretRecoveryPhraseDto: ConfirmSecretRecoveryPhraseDto,
  ) {
    const { email, confirmSecretRecovery } = confirmSecretRecoveryPhraseDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const joinConfirmSecret = confirmSecretRecovery.join(' ');

    const isSecretMatch = await bcrypt.compare(
      joinConfirmSecret,
      user.secretRecovery,
    );

    if (!isSecretMatch) {
      throw new HttpException(
        'Secret recovery phrase does not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Secret recovery phrase matches',
    };
  }

  private generateAccessToken(userId: string, userEmail: string): string {
    const payload = { userId, userEmail };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
  }
}
