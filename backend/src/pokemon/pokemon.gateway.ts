import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PokemonService } from './pokemon.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class PokemonGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private pokemonService: PokemonService) {}

  async handleConnection(client: Socket) {
    try {
      console.log(`Cliente conectado: ${client.id}`);
    } catch (error) {
      console.error('Error en conexión:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get-pokemon-sprite')
  async handleGetSprite(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data.user?.userId;

      if (!userId) {
        client.emit('error', { message: 'Usuario no autenticado' });
        return;
      }

      const sprite = await this.pokemonService.getRandomPokemonSprite(userId);

      client.emit('pokemon-sprite', {
        id: sprite.id,
        pokemonId: sprite.pokemonId,
        name: sprite.name,
        spriteUrl: sprite.spriteUrl,
        userId: sprite.userId,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('delete-sprite')
  async handleDeleteSprite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { spriteId: number },
  ) {
    try {
      const userId = client.data.user?.userId;

      if (!userId) {
        client.emit('error', { message: 'Usuario no autenticado' });
        return;
      }

      const deleted = await this.pokemonService.deleteSprite(
        data.spriteId,
        userId,
      );

      if (deleted) {
        client.emit('sprite-deleted', { id: data.spriteId });
      } else {
        client.emit('error', { message: 'No se pudo eliminar el sprite' });
      }
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get-user-sprites')
  async handleGetUserSprites(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data.user?.userId;

      if (!userId) {
        client.emit('error', { message: 'Usuario no autenticado' });
        return;
      }

      const sprites = await this.pokemonService.getUserSprites(userId);
      client.emit('user-sprites', sprites);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
