import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto.ts';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from 'src/common/services/otp/otp.service';
import { VerifyOtpDTO } from 'src/common/services/otp/dto/verify-otp.dto';
import { RequestOtpDto } from 'src/common/services/otp/dto/request-otp.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SecretRecoveryPhraseDto } from './dto/secre-recovery.dto';
import { ConfirmSecretRecoveryPhraseDto } from './dto/confirm-secret-recovery.dto';

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
  }

  @ApiOperation({ summary: 'User request for Otp' })
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    const { email } = requestOtpDto;
    await this.otpService.requestOtp({ email });
  }

  @ApiOperation({ summary: 'User verify Otp' })
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpdto: VerifyOtpDTO) {
    const { email, otp } = verifyOtpdto;
    await this.otpService.verifyOtp({ email, otp });
  }

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User forget their password' })
  @Post('forget-Password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.authService.forgetPassword(forgetPasswordDto);
  }

  @ApiOperation({ summary: 'User reset their password' })
  @Post('reset-Password')
  async rresetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'User select secret recovery phrase' })
  @Post('update-secret-recovery-phrase')
  async updateSecretRecoveryPhrase(
    @Body() secretRecoveryPhraseDto: SecretRecoveryPhraseDto,
  ) {
    return await this.authService.updateSecreRecoveryPhrase(
      secretRecoveryPhraseDto,
    );
  }

  @ApiOperation({ summary: 'User confirm thier secret recovery phrase' })
  @Post('confirm-secret-recovery-phrase')
  async confirmSecretRecoveryPhrase(
    @Body() confirmSecretRecoveryPhraseDto: ConfirmSecretRecoveryPhraseDto,
  ) {
    await this.authService.confirmSecreRecoveryPhrase(
      confirmSecretRecoveryPhraseDto,
    );
  }
}
