export interface IPokemonsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface IPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default?: string; other?: any };
  types: { slot: number; type: { name: string; url: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}