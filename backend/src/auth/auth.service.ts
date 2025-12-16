import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, LoginResponse } from './models/user.model';

@Injectable()
export class AuthService {
  private readonly Users = [{ id: 1, username: 'sofia', passwordHash: '$2b$10$w85V/nJ/L2JpI0mF8y3YwuG...' }];

  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = this.Users.find((u) => u.username === loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Credenciales Invalidas');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales Invalidas');
    }

    const payload: JwtPayload = { username: user.username, userId: user.id };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      username: user.username,
      userId: user.id,
    };
  }
}
