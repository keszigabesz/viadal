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
