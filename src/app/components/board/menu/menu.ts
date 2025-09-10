import { Component, inject, computed, signal } from '@angular/core';
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

  // Add turn-related computeds
  currentPlayer = computed(() => this.gameState.getCurrentPlayer());
  turnNumber = computed(() => this.gameState.getTurnNumber());

  private isBattleCalculating = signal(false);

  attackerRemainingForce = computed(() => {
    const result = this.battleState().battleResult;
    if (!result) return 0;
    return Math.max(0, (result.originalAttackerStrength ?? 0) - (result.attackerLosses ?? 0));
  });

  defenderRemainingForce = computed(() => {
    const result = this.battleState().battleResult;
    if (!result) return 0;
    return Math.max(0, (result.originalDefenderStrength ?? 0) - (result.defenderLosses ?? 0));
  });

  isBattleButtonDisabled = computed(() => this.isBattleCalculating());

  async onStartBattle() {
    const battleState = this.battleState();
    if (battleState.attackingArmy && battleState.defendingArmy && !this.isBattleCalculating()) {
      this.isBattleCalculating.set(true);
      try {
        await this.battleService.executeBattleCalculation(battleState.attackingArmy.id, battleState.defendingArmy.id);
      } finally {
        this.isBattleCalculating.set(false);
      }
    }
  }

  onResolveBattle() {
    this.gameState.deselectArmy();
    this.gameState.endBattle();
  }

  // Add end turn method
  onEndTurn() {
    this.gameState.endTurn();
  }
}
