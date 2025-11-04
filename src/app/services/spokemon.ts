import { Injectable } from '@angular/core';

export interface PokemonListItem {
  id: number;
  name: string;
  /** en la lista puede venir o no; por eso opcional */
  url?: string;
  /** para mostrar chips en la lista */
  types?: { type: { name: string } }[];
}

@Injectable({ providedIn: 'root' })
export class SPokemonService {
  private base = 'https://pokeapi.co/api/v2';

  /** Lista paginada */
  async getPokemons(offset = 0, limit = 20): Promise<PokemonListItem[]> {
    const r = await fetch(`${this.base}/pokemon?offset=${offset}&limit=${limit}`);
    const data = await r.json();

    const base: PokemonListItem[] = (data.results ?? []).map((x: any) => {
      const id = Number(x.url.split('/').filter(Boolean).pop());
      return { id, name: x.name, url: x.url };
    });

    return base;
  }

  /** Detalle para id o nombre */
  async getPokemon(idOrName: string | number): Promise<any> {
    const r = await fetch(`${this.base}/pokemon/${idOrName}`);
    if (!r.ok) throw new Error('Not found');
    return r.json();
  }
}
