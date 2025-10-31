import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonGateway } from './pokemon.gateway';
import { PokemonService } from './pokemon.service';
import { Sprite } from './entities/sprite.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sprite]), AuthModule],
  providers: [PokemonGateway, PokemonService],
})
export class PokemonModule {}
