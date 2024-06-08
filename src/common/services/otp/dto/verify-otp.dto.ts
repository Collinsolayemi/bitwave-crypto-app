import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  otp: string;

  @IsString()
  @ApiPropertyOptional()
  email?: string;
}
