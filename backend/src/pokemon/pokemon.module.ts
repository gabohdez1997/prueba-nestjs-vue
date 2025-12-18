import { Module } from '@nestjs/common';
import { PokemonGateway } from './pokemon.gateway';
import { PokemonService } from './pokemon.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PokemonGateway, PokemonService],
})
export class PokemonModule {}