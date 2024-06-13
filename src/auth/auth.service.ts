import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

    return user;
  }

  async comparePassword(inputPassword: string, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const isPasswordMatch = await bcrypt.compare(inputPassword, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect email or password');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    await this.comparePassword(password, email);

    const accessToken = this.generateAccessToken(user.id, user.email);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
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
    };
  }

  private generateAccessToken(userId: string, userEmail: string): string {
    const payload = { userId, userEmail };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
  }
}
