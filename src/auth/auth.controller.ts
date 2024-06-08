import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/create-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User signup' })
  @Post('/signup')
  async signup(@Body() signUpdto: SignupDto, @Res() res) {
    await this.authService.signup(signUpdto);
    return res.status(201).json({ message: 'Check your email for otp' });
  }

  @ApiOperation({ summary: 'User request for Otp' })
  @Post('request-otp')
  async requestOtp(@Body() signUpdto: SignupDto, @Res() res) {
    await this.authService.signup(signUpdto);
    return res.status(201).json({ message: 'Check your email for otp' });
  }

  @ApiOperation({ summary: 'User verify Otp' })
  @Post('verify-otp')
  async verifyOtp(@Body() signUpdto: SignupDto, @Res() res) {
    await this.authService.signup(signUpdto);
    return res.status(201).json({ message: 'Check your email for otp' });
  }


  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
