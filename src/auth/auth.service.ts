import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
  const { email, password, nickname } = registerDto;
  const user = this.usersRepository.create({ email, password, nickname });
  const savedUser = await this.usersRepository.save(user);

  const { password: _, ...userWithoutPassword } = savedUser;
  return userWithoutPassword;
}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || user.password !== password) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    const userWithoutPassword = { ...user } as any;
    delete userWithoutPassword.password;

    return {
        access_token: token,
        user: userWithoutPassword,
    };
}
}