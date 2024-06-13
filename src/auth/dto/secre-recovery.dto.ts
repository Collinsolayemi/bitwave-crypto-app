import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SecretRecoveryPhraseDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The secret recovery phrase of the user',
    example: 'my-secret-recovery-phrase',
  })
  @IsString()
  @IsNotEmpty()
  secretRecovery: string;
}
