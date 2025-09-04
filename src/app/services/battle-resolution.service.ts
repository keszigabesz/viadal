import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class BattleResolutionService {
  private gameState = inject(GameStateService);

  resolveDecisiveVictory(attackingArmyId: string, defendingArmyId: string): void {
    const battleState = this.gameState.getBattleState();
    this.gameState.removeArmy(defendingArmyId);
    if (battleState.defendingArmy?.position) {
      this.gameState.moveArmy(attackingArmyId, battleState.defendingArmy.position);
    }
  }

  resolveAttackerWins(attackingArmyId: string, defendingArmyId: string): string | null {
    const battleState = this.gameState.getBattleState();
    const defendingArmyStrength = battleState.defendingArmy?.strength ?? 0;
    const lossAmount = Math.ceil(defendingArmyStrength / 3);
    const newDefendingStrength = defendingArmyStrength - lossAmount;

    if (newDefendingStrength <= 0) {
      this.gameState.removeArmy(defendingArmyId);
      if (battleState.defendingArmy?.position) {
        this.gameState.moveArmy(attackingArmyId, battleState.defendingArmy.position);
      }
    } else {
      this.gameState.updateArmyStrength(defendingArmyId, newDefendingStrength);
      if (battleState.defendingArmy?.position) {
        this.gameState.moveArmy(attackingArmyId, battleState.defendingArmy.position);
      }
      return defendingArmyId; // Signal that defender needs to retreat
    }
    return null;
  }

  resolveDefenderWins(attackingArmyId: string, defendingArmyId: string): string | null {
    const battleState = this.gameState.getBattleState();
    const defendingArmyStrength = battleState.defendingArmy?.strength ?? 0;
    const lossAmount = Math.ceil(defendingArmyStrength / 3);
    const attackingArmyCurrentStrength = battleState.attackingArmy?.strength ?? 0;
    const newAttackingStrength = attackingArmyCurrentStrength - lossAmount;

    if (newAttackingStrength <= 0) {
      this.gameState.removeArmy(attackingArmyId);
      return null;
    } else {
      this.gameState.updateArmyStrength(attackingArmyId, newAttackingStrength);
      return attackingArmyId; // Signal that attacker needs to retreat
    }
  }

  resolveMutualLosses(attackingArmyId: string, defendingArmyId: string): { attackerRetreat: string | null; defenderRetreat: string | null } {
    const battleState = this.gameState.getBattleState();
    const defendingArmyStrength = battleState.defendingArmy?.strength ?? 0;
    const lossAmount = Math.ceil(defendingArmyStrength / 5);

    const attackingArmyCurrentStrength = battleState.attackingArmy?.strength ?? 0;
    const newAttackingStrength = attackingArmyCurrentStrength - lossAmount;
    
    let attackerRetreat: string | null = null;
    let defenderRetreat: string | null = null;

    if (newAttackingStrength <= 0) {
      this.gameState.removeArmy(attackingArmyId);
    } else {
      this.gameState.updateArmyStrength(attackingArmyId, newAttackingStrength);
      attackerRetreat = attackingArmyId;
    }

    const newDefendingStrength = defendingArmyStrength - lossAmount;

    if (newDefendingStrength <= 0) {
      this.gameState.removeArmy(defendingArmyId);
    } else {
      this.gameState.updateArmyStrength(defendingArmyId, newDefendingStrength);
      defenderRetreat = defendingArmyId;
    }

    return { attackerRetreat, defenderRetreat };
  }
}