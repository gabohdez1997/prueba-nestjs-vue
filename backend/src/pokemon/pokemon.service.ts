import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Sprite } from './entities/sprite.entity';

@Injectable()
export class PokemonService {
  private readonly POKEAPI_URL = 'https://pokeapi.co/api/v2';
  private readonly MAX_POKEMON_ID = 898; // Gen 1-8

  constructor(
    @InjectRepository(Sprite)
    private spritesRepository: Repository<Sprite>,
  ) {}

  async getRandomPokemonSprite(userId: number): Promise<Sprite> {
    const randomId = Math.floor(Math.random() * this.MAX_POKEMON_ID) + 1;

    try {
      const response = await axios.get(
        `${this.POKEAPI_URL}/pokemon/${randomId}`,
      );
      const pokemon = response.data;

      const sprite = this.spritesRepository.create({
        pokemonId: pokemon.id,
        name: pokemon.name,
        spriteUrl: pokemon.sprites.front_default || pokemon.sprites.front_shiny,
        userId,
      });

      return await this.spritesRepository.save(sprite);
    } catch (error) {
      throw new Error(`Error al obtener sprite de Pokémon: ${error.message}`);
    }
  }

  async getUserSprites(userId: number): Promise<Sprite[]> {
    return this.spritesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteSprite(spriteId: number, userId: number): Promise<boolean> {
    const result = await this.spritesRepository.delete({
      id: spriteId,
      userId,
    });
    return result.affected > 0;
  }
}
