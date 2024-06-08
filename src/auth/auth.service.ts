import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/create-auth.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signup(payload: SignupDto) {
    const { email, password } = payload;

    // Check if the user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.userService.create({
      email,
      password: hashedPassword,
    });

    const otp = await this.generateOtp();
    const message = `Thank you for signing up and welcome aboard the good ship.
    
    Your OTP:
          ${otp}
          This OTP is valid for 2 minutes.
          <br /><br /><br />Cheers!<br />
          The Bitwave FX Team.`;

    this.eventEmitter.emit(
      'email',
      user,
      'otp-email',
      'OTP for account verification',
      otp
    );

    return user;
  }

  async generateOtp() {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    const otpString = otp.toString();
    return otpString;
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
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
      // console.error;
    }
  }
}
