import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokemonService {
  
  async getRandomPokemon() {
    // Generar ID random entre 1 y 151 (Primera generación)
    const randomId = Math.floor(Math.random() * 151) + 1;
    
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      
      return {
        id: response.data.id,
        name: response.data.name,
        // Obtenemos la imagen frontal
        sprite: response.data.sprites.front_default,
      };
    } catch (error) {
      console.error('Error fetching pokemon', error);
      return null;
    }
  }
}