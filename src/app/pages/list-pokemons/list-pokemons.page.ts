import { SPokemonService } from '../../services/spokemon';         // ← OJO: sin ".service"
import { IPokemon } from '../../interfaces/pokemon';               // ← OJO: sin ".interface"

import {
  IonContent, IonList, IonItem, IonAvatar, IonLabel, IonChip,
  IonButtons, IonButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  imports: [
    IonContent, IonList, IonItem, IonAvatar, IonLabel, IonChip,
    IonButtons, IonButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent
  ],
})
export class ListPokemonsPage {
  items: IPokemon[] = [];
  offset = 0;

  constructor(private sPokemon: SPokemonService, private router: Router) {}

  async ngOnInit() {
    await this.loadMore();
  }

  async loadMore() {
    const chunk = await this.sPokemon.getPokemons(this.offset, 20);
    this.items.push(...chunk);
  }

  async getMorePokemons(ev: Event) {
    this.offset += 20;
    await this.loadMore();
    (ev.target as HTMLIonInfiniteScrollElement).complete();
  }

  goToDetail(p: IPokemon) {
    this.router.navigate(['/detail-pokemon', p.id]);
  }

  trackById(_i: number, x: IPokemon) { return x.id; }
}