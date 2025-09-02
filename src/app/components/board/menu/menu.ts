import { Component, inject, computed } from '@angular/core';
import { GameStateService } from '@/app/services/game-state.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private gameState = inject(GameStateService);

  selectedArmy = computed(() => this.gameState.getSelectedArmy());
  isBattleOngoing = computed(() => this.gameState.isBattleOngoing());
  battleState = computed(() => this.gameState.getBattleState());
}
