import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  // @ApiProperty()
  // @IsDefined()
  // @IsNotEmpty()
  // @IsString()
  // firstName: string;

  // @ApiProperty()
  // @IsDefined()
  // @IsNotEmpty()
  // @IsString()
  // lastName: string;

  // @ApiPropertyOptional({ default: 'mm/dd/yyyy' })
  // @IsOptional()
  // @IsString()
  // dob?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*\d)(?=.*[!"#$%&'()+,-.:;<=>?@[\]^_`{|}~*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    {
      message: 'password is too weak',
    },
  )
  password: string;
}
