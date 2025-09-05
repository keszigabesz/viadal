import { Component, inject, computed } from '@angular/core';
import { GameStateService } from '@/app/services/game-state.service';
import { BattleService } from '@/app/services/battle.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private gameState = inject(GameStateService);
  private battleService = inject(BattleService);

  selectedArmy = computed(() => this.gameState.getSelectedArmy());
  isBattleOngoing = computed(() => this.gameState.isBattleOngoing());
  battleState = computed(() => this.gameState.getBattleState());

  onStartBattle() {
    const battleState = this.battleState();
    if (battleState.attackingArmy && battleState.defendingArmy) {
      this.battleService.executeBattleCalculation(battleState.attackingArmy.id, battleState.defendingArmy.id);
    }
  }

  onResolveBattle() {
    this.gameState.deselectArmy();
    this.gameState.endBattle();
  }
}
