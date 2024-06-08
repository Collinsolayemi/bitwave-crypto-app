import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user, minimum length is 6 characters',
    example: 'strongpassword123',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
