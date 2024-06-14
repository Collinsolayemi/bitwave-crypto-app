import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { User } from 'src/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OtpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
    private mailService: MailerService,
  ) {}

  async generateOtp() {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    const otpString = otp.toString();
    return otpString;
  }

  async verifyOtp({ email, otp }: { email: string; otp: string }) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otpExpiration && user.otpExpiration < new Date()) {
      user.otp = null;
      user.otpExpiration = null;
      await this.userRepository.save(user);
      throw new BadRequestException('OTP has expired');
    }

    const isOtpMatch = await bcrypt.compare(otp, user.otp);

    if (!isOtpMatch) {
      throw new BadRequestException('OTP mismatch');
    }

    user.otp = null;
    user.otpExpiration = null;
    await this.userRepository.save(user);

    return {
      message: 'Account verified successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async requestOtp({ email }: { email: string }) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = await this.generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpiration = otpExpiration;
    await this.userRepository.save(user);

    this.eventEmitter.emit(
      'email',
      user,
      'otp-email',
      'OTP for Account Verification',
      otp,
    );

    return {
      message: 'OTP has been sent to your email',
      statusCode: HttpStatus.OK,
    };
  }

  @OnEvent('email', { async: true, promisify: true })
  async sendEmail(
    user: User | any,
    template: string,
    subject: string,
    otp?: string | null,
  ) {
    const date = new Date();
    const year = date.getFullYear();
    const email = user.email;

    const welcomeEmail = {
      from: 'Bitwave FX <merchant@checkretail.tech>',
      to: email,
      //bcc: 'Samuel Osinloye <psalmueloye@gmail.com>, olosundetobi1@gmail.com',
      subject,
      template,
      context: {
        email,
        otp,
        date: date,
        year: year,
      },
    };
    try {
      await this.mailService.sendMail(welcomeEmail);
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  }
}
