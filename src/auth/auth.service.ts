import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signup(payload: SignupDto) {
    const { email, password } = payload;

    // Check if the user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    return user;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
