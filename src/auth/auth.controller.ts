import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from 'src/common/services/otp/otp.service';
import { VerifyOtpDTO } from 'src/common/services/otp/dto/verify-otp.dto';
import { RequestOtpDto } from 'src/common/services/otp/dto/request-otp.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SecretRecoveryPhraseDto } from './dto/secre-recovery.dto';
import { ConfirmSecretRecoveryPhraseDto } from './dto/confirm-secret-recovery.dto';
import { SignupStep1Dto, SignupStep2Dto } from './dto/signup.dto.ts';
import { CreateWalletDto } from 'src/common/services/blockcypher/dto/create-wallet.dto';
import { BlockCypherService } from 'src/common/services/blockcypher/blockcypher.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private blockCypherService: BlockCypherService,
  ) {}

  @ApiOperation({ summary: 'User signup' })
  @Post('signup-step1')
  async signupStep1(@Body() signUpdto: SignupStep1Dto) {
    return await this.authService.signupStep1(signUpdto);
  }

  @ApiOperation({ summary: 'User signup' })
  @Post('signup-step2')
  async signupStep2(@Body() signUpdto: SignupStep2Dto) {
    return await this.authService.signUpStep2(signUpdto);
  }

  @ApiOperation({ summary: 'User request for Otp' })
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    const { email } = requestOtpDto;
    return await this.otpService.requestOtp({ email });
  }

  @ApiOperation({ summary: 'User verify Otp' })
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpdto: VerifyOtpDTO) {
    const { email, otp } = verifyOtpdto;
    return await this.otpService.verifyOtp({ email, otp });
  }

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User forget their password' })
  @Post('forget-Password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return await this.authService.forgetPassword(forgetPasswordDto);
  }

  @ApiOperation({ summary: 'User reset their password' })
  @Post('reset-Password')
  async rresetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
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
    return await this.authService.confirmSecretRecoveryPhrase(
      confirmSecretRecoveryPhraseDto,
    );
  }
}
