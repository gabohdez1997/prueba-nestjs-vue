import { 
  WebSocketGateway, 
  SubscribeMessage, 
  WebSocketServer, 
  OnGatewayConnection 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PokemonService } from './pokemon.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true }) // Importante: cors true para que Vue se conecte
export class PokemonGateway implements OnGatewayConnection {
  
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly jwtService: JwtService
  ) {}

  // Este método se ejecuta AUTOMÁTICAMENTE cuando alguien intenta conectarse
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization as string;
    
    // Si no hay token, lo desconectamos "a la fuerza"
    if (!token) {
      console.log('Cliente desconectado: Sin token');
      client.disconnect();
      return;
    }

    try {
      // Limpiamos el "Bearer " si viene en el string
      const cleanToken = token.replace('Bearer ', '');
      // Validamos el token. Si falla, lanza error y va al catch
      this.jwtService.verify(cleanToken, { secret: 'una_clave_super_secreta_123' }); // Ojo: Usa la misma clave del .env o auth.module
      console.log(`Cliente conectado: ${client.id}`);
    } catch (e) {
      console.log('Cliente desconectado: Token inválido');
      client.disconnect();
    }
  }

  // Este método escucha cuando el frontend dice "quiero_pokemon"
  @SubscribeMessage('request_pokemon')
  async handleRequestPokemon(client: Socket) {
    console.log('Cliente pidió un pokemon...');
    const pokemon = await this.pokemonService.getRandomPokemon();
    
    // Le respondemos SOLO a ese cliente con el evento 'new_pokemon'
    client.emit('new_pokemon', pokemon);
  }
}