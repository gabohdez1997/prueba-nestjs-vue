import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractToken(client);

      if (!token) {
        throw new WsException('Token no proporcionado');
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = { userId: payload.sub, username: payload.username };

      return true;
    } catch (err) {
      throw new WsException('Token inválido');
    }
  }

  private extractToken(client: Socket): string | undefined {
    const token =
      client.handshake?.auth?.token || client.handshake?.headers?.authorization;
    if (token?.startsWith('Bearer ')) {
      return token.substring(7);
    }
    return token;
  }
}
