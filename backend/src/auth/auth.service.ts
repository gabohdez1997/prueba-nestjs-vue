import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, LoginResponse } from './models/user.model';

interface User {
  id: number;
  username: string;
  passwordHash: string;
}

@Injectable()
export class AuthService {
  // private readonly Users = [{ id: 1, username: 'sofia', passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSO9.d5qlj.C.W/W.W/W.W/W' }];
  private Users: User[] = [];

  constructor(private jwtService: JwtService) {

    const passwordHash = bcrypt.hashSync('123456', 10);
    
    this.Users = [
      { id: 1, username: 'sofia', passwordHash: passwordHash }
    ];
  }

  async register(registerDto: LoginDto) {
    // 1. Verificar si ya existe
    const existingUser = this.Users.find(u => u.username === registerDto.username);
    if (existingUser) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }

    // 2. Encriptar contraseña
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // 3. Crear usuario
    const newUser: User = {
      id: this.Users.length + 1, // ID autoincremental simple
      username: registerDto.username,
      passwordHash: passwordHash,
    };

    // 4. Guardar en memoria
    this.Users.push(newUser);

    return {
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, username: newUser.username }
    };
  }

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
