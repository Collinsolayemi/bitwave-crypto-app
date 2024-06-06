import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString, IsOptional, MinLength, MaxLength, Matches } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    lastName: string;
  
    @ApiPropertyOptional({ default: 'mm/dd/yyyy' })
    @IsOptional()
    @IsString()
    dob?: string;
  
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    email: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    gender?: string;
  
    @ApiProperty()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    altPhoneNumber?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    role?: string;
  
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
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    deviceToken?: string;
  }
  