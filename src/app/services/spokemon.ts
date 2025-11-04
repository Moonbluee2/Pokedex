import { Injectable } from '@angular/core';

// Ajusta estos imports si tu archivo de interfaces tiene otros nombres
import { IPokemon, IPokemonsResponse } from '../interfaces/pokemon';

@Injectable({ providedIn: 'root' })
export class SPokemonService {
  private readonly base = 'https://pokeapi.co/api/v2';

  /** Lista con paginación (offset/limit) */
  async getPokemons(offset = 0, limit = 20): Promise<IPokemon[]> {
    const listRes = await fetch(`${this.base}/pokemon?offset=${offset}&limit=${limit}`);
    const listData = (await listRes.json()) as IPokemonsResponse;

    // Trae los detalles en paralelo pero en lotes para no saturar
    const urls = listData.results.map(r => r.url);
    const details = await this.fetchBatch(urls, 8);
    return details.map(d => this.processPokemon(d));
  }

  /** Detalle por id o nombre */
  async getPokemon(idOrName: number | string): Promise<IPokemon> {
    const res = await fetch(`${this.base}/pokemon/${idOrName}`);
    const data = (await res.json()) as IPokemon;
    return this.processPokemon(data);
  }

  /** ---------- Helpers ---------- */

  /** Trae URLs en lotes de n paralelas */
  private async fetchBatch(urls: string[], batch = 8): Promise<IPokemon[]> {
    const out: IPokemon[] = [];
    for (let i = 0; i < urls.length; i += batch) {
      const slice = urls.slice(i, i + batch);
      const res = await Promise.allSettled(slice.map(u => fetch(u).then(r => r.json())));
      for (const r of res) if (r.status === 'fulfilled') out.push(r.value as IPokemon);
    }
    return out;
  }

  /** Normaliza/calcúla campos que usas en UI */
  private processPokemon(p: IPokemon): IPokemon {
    // aquí podrías calcular campos derivados si lo necesitas
    return p;
  }
}
