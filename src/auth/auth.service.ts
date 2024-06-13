import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto.ts';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UserService,
    private otpService: OtpService,
  ) {}

  async signup(signupDto: SignupDto) {
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
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Ensure secretRecovery is not empty or undefined
    if (!secretRecovery) {
      throw new HttpException(
        'Secret recovery phrase is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the secret recovery phrase with bcrypt
    const hashedSecretPhrase = await bcrypt.hash(secretRecovery, 10);

    // Update user's secret recovery phrase with hashed value
    user.secretRecovery = hashedSecretPhrase;

    // Save the updated user object to the database
    await this.userRepository.save(user);

    // Return success message
    return {
      statusCode: HttpStatus.OK,
      message: 'Secret recovery phrase updated successfully',
    };
  }

  // async confirmSecreRecoveryPhrase(
  //   confirmSecretRecoveryPhrase: ConfirmSecretRecoveryPhraseDto,
  // ) {
  //   const { email, confirmSecretRecovery } = confirmSecretRecoveryPhrase;
  //   const user = await this.userRepository.findOne({ where: { email } });

  //   if (!user) {
  //     throw new HttpException(
  //       `User with email ${email} not found`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const isSecretMatch = await bcrypt.compare(
  //     confirmSecretRecovery,
  //     user.secretRecovery,
  //   );
  //   console.log(isSecretMatch);

  //   if (!isSecretMatch) {
  //     throw new HttpException(
  //       'secret recovery phrase does not match',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Secret recovery phrase updated successfully',
  //   };
  // }

  async confirmSecreRecoveryPhrase(
    confirmSecretRecoveryPhrase: ConfirmSecretRecoveryPhraseDto,
  ) {
    const { email, confirmSecretRecovery } = confirmSecretRecoveryPhrase;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isSecretMatch = await bcrypt.compare(
      confirmSecretRecovery,
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
