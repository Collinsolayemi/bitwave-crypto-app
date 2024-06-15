import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayMaxSize,
} from 'class-validator';

export class SecretRecoveryPhraseDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'The secret recovery phrase of the user, consisting of 12 words',
    example: [
      'word1',
      'word2',
      'word3',
      'word4',
      'word5',
      'word6',
      'word7',
      'word8',
      'word9',
      'word10',
      'word11',
      'word12',
    ],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(12)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  secretRecovery: string[];
}
