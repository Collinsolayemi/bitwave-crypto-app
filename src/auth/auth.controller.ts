import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto.ts';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from 'src/common/services/otp/otp.service';
import { VerifyOtpDTO } from 'src/common/services/otp/dto/verify-otp.dto';
import { RequestOtpDto } from 'src/common/services/otp/dto/request-otp.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private otpService: OtpService,
  ) {}

  @ApiOperation({ summary: 'User signup' })
  @Post('signup')
  async signup(@Body() signUpdto: SignupDto, @Res() res) {
    await this.authService.signup(signUpdto);
    return res.status(201).json({ message: 'Check your email for otp' });
  }

  @ApiOperation({ summary: 'User request for Otp' })
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto, @Res() res) {
    const { email } = requestOtpDto;
    await this.otpService.requestOtp({ email });
    return res.status(201).json({ message: 'Check your email for otp' });
  }

  @ApiOperation({ summary: 'User verify Otp' })
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpdto: VerifyOtpDTO, @Res() res) {
    const { email, otp } = verifyOtpdto;
    await this.otpService.verifyOtp({ email, otp });
    return res.status(201).json({ message: 'Account verified successfully' });
  }

  // @ApiOperation({ summary: 'User login' })
  // @Post('login')
  // async login(@Body() loginDto: LoginDto, @Res() res: Response) {
  //   const { email, password } = loginDto;
  //   const result = await this.authService.login({ email, password });
  //   return res.status(200).json(result);
  // }


  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
