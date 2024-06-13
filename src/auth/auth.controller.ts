import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto.ts';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from 'src/common/services/otp/otp.service';
import { VerifyOtpDTO } from 'src/common/services/otp/dto/verify-otp.dto';
import { RequestOtpDto } from 'src/common/services/otp/dto/request-otp.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @ApiOperation({ summary: 'User signup' })
  @Post('signup')
  async signup(@Body() signUpdto: SignupDto) {
    await this.authService.signup(signUpdto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Check your email for otp',
    };
  }

  @ApiOperation({ summary: 'User request for Otp' })
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    const { email } = requestOtpDto;
    await this.otpService.requestOtp({ email });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Check your email for otp',
    };
  }

  @ApiOperation({ summary: 'User verify Otp' })
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpdto: VerifyOtpDTO) {
    const { email, otp } = verifyOtpdto;
    await this.otpService.verifyOtp({ email, otp });
    return {
      statusCode: HttpStatus.OK,
      message: 'Account verified successfully',
    };
  }

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  @ApiOperation({ summary: 'User forget their password' })
  @Post('forgetPassword')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const result = await this.authService.forgetPassword(forgetPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
