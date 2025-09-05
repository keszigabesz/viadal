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
      
      // Handle retreat for mutual losses - only go back 2 positions
      const army = battleState.attackingArmy;
      if (army && army.positionHistory.length >= 3) {
        // Go back 2 positions (index 2 in the position history)
        const retreatPosition = army.positionHistory[2];
        this.gameState.moveArmy(attackingArmyId, retreatPosition);
      } else if (army && army.positionHistory.length >= 2) {
        // If less than 3 positions in history, go back 1 position
        const retreatPosition = army.positionHistory[1];
        this.gameState.moveArmy(attackingArmyId, retreatPosition);
      }
      // Don't set attackerRetreat since we handle the movement here
    }

    const newDefendingStrength = defendingArmyStrength - lossAmount;

    if (newDefendingStrength <= 0) {
      this.gameState.removeArmy(defendingArmyId);
    } else {
      this.gameState.updateArmyStrength(defendingArmyId, newDefendingStrength);
    }

    return { attackerRetreat: null, defenderRetreat: null };
  }
}