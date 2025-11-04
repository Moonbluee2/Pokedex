import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonChip, IonLabel, IonFab, IonFabButton, IonIcon
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { SPokemonService } from '../../services/spokemon';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

/** Tipos relajados para que coincidan con tu IPokemon **/
interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string; url?: string } }[];
  abilities: { is_hidden: boolean; ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites?: { other?: { 'official-artwork'?: { front_default?: string } } };
}

@Component({
  standalone: true,
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonChip, IonLabel, IonFab, IonFabButton, IonIcon
  ],
})
export class DetailPokemonPage {
  loading = signal(true);
  pokemon = signal<Pokemon | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: SPokemonService
  ) {
    addIcons({ close });
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  private async load(idOrName: string) {
    try {
      this.loading.set(true);
      const p = await this.api.getPokemon(idOrName);
      this.pokemon.set(p as Pokemon);
    } finally {
      this.loading.set(false);
    }
  }

  imgOf(p: Pokemon): string {
    return p.sprites?.other?.['official-artwork']?.front_default
      ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
  }

  statPercent(v: number) { return Math.min(100, Math.round((v / 200) * 100)); }
  typeClass(name: string) { return `type-${name}`; }
  goBack() { this.router.navigateByUrl('/list-pokemons'); }
}
