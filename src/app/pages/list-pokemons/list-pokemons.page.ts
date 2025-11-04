import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButton, IonAvatar, IonIcon, IonChip
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SPokemonService, PokemonListItem } from '../../services/spokemon';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonAvatar, IonIcon, IonChip
  ],
})
export class ListPokemonsPage {
  items = signal<PokemonListItem[]>([]);
  offset = 0;
  limit = 20;
  loading = signal(false);

  constructor(private api: SPokemonService, private router: Router) {
    addIcons({ chevronForward });
    this.load();
  }

  async load() {
    if (this.loading()) return;
    this.loading.set(true);

    // 1) Trae la página de resultados
    const batch = await this.api.getPokemons(this.offset, this.limit); // PokemonListItem[]

    // 2) Completa los "types" de cada item (sin cambiar su tipo)
    await Promise.all(
      batch.map(async (p) => {
        try {
          const d = await this.api.getPokemon(p.id);
          p.types = d?.types ?? [];
        } catch {
          p.types = [];
        }
      })
    );

    // 3) Actualiza la señal respetando el tipo PokemonListItem[]
    this.items.update(prev => ([...prev, ...batch]));
    this.offset += this.limit;
    this.loading.set(false);
  }

  img(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  typeClass(name: string) { return `type-${name}`; }

  goDetail(p: PokemonListItem) {
    this.router.navigate(['/detail', p.id]);
  }
}
