import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  IonChip, IonLabel,
  IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { SPokemonService } from '../../services/spokemon';
import { IPokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [
    CommonModule, TitleCasePipe,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    IonChip, IonLabel,
    IonButtons, IonBackButton
  ],
})
export class DetailPokemonPage implements OnInit {
  // Con withComponentInputBinding, si la ruta tiene :id, Angular intenta asignarlo aquí.
  @Input() id!: string;

  private sPokemon = inject(SPokemonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pokemon = signal<IPokemon | null>(null);
  loading = signal<boolean>(true);

  async ngOnInit() {
    // 🔁 Fallback #1: si por alguna razón @Input no llegó todavía, lee de la ruta.
    const routeId = this.route.snapshot.paramMap.get('id');
    if (!this.id && routeId) this.id = routeId;

    // 🔁 Fallback #2: si sigue sin id, regresa a la lista.
    if (!this.id || this.id === 'undefined' || this.id === 'null') {
      this.router.navigateByUrl('/list-pokemons');
      return;
    }

    try {
      const data = await this.sPokemon.getPokemon(this.id);
      this.pokemon.set(data);
    } catch {
      this.router.navigateByUrl('/list-pokemons');
      return;
    } finally {
      this.loading.set(false);
    }
  }

  typeClass(typeName: string): string { return 'chip-' + typeName.toLowerCase(); }

  // Usa official-artwork si existe; si no, el sprite frontal; si no, vacío.
  imgOf(p: IPokemon | null): string {
    if (!p) return '';
    return (
      p?.sprites?.other?.['official-artwork']?.front_default ??
      p?.sprites?.front_default ??
      ''
    );
  }
  

  // 0..200 → 0..100%
  statPercent(v: number): number {
    const clamped = Math.max(0, Math.min(200, v ?? 0));
    return (clamped / 200) * 100;
  }

  goBack() { this.router.navigateByUrl('/list-pokemons'); }
}

