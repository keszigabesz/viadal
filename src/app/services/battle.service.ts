import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { DiceService } from './dice.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  private gameState = inject(GameStateService);
  private diceService = inject(DiceService);

  canAttackArmy(attackingArmyId: string, defendingArmyId: string): boolean {
    const attackingArmy = this.gameState.armies().find((army) => army.id === attackingArmyId);
    const defendingArmy = this.gameState.armies().find((army) => army.id === defendingArmyId);

    return attackingArmy?.owner !== defendingArmy?.owner;
  }

  initiateArmyBattle(attackingArmyId: string, defendingArmyId: string): void {
    this.gameState.startBattle(attackingArmyId, defendingArmyId);

    const battleState = this.gameState.getBattleState();
    const diceCast = this.diceService.rollDie();
    const rawRatio =
      (battleState.attackingArmy?.strength ?? 1) / (battleState.defendingArmy?.strength ?? 1);
    let ratio = rawRatio >= 1 ? Math.floor(rawRatio) : Math.floor(rawRatio * 10) / 10;
    if (ratio >= 6 && ratio <= 9) {
      ratio = 5;
    }
    const diceTimesRatio = diceCast * ratio;

    if (ratio >= 10) {
      this.gameState.removeArmy(defendingArmyId);
      if (battleState.defendingArmy?.position) {
        this.gameState.moveArmy(attackingArmyId, battleState.defendingArmy.position);
      }
    } else if ((diceCast === 6 && ratio >= 0.5) || diceTimesRatio >= 10) {
      // Attacker wins: defender loses one third of their strength
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
        // Defender retreats
        this.initiateRetreat(defendingArmyId);
      }
    } else if (diceTimesRatio < 2 || (diceCast === 1 && ratio === 2) || ratio < 0.5) {
      // Defender wins: attacker loses one third of defender's strength and retreats
      const defendingArmyStrength = battleState.defendingArmy?.strength ?? 0;
      const lossAmount = Math.ceil(defendingArmyStrength / 3);
      const attackingArmyCurrentStrength = battleState.attackingArmy?.strength ?? 0;
      const newAttackingStrength = attackingArmyCurrentStrength - lossAmount;

      if (newAttackingStrength <= 0) {
        this.gameState.removeArmy(attackingArmyId);
      } else {
        this.gameState.updateArmyStrength(attackingArmyId, newAttackingStrength);
        // Attacker retreats
        this.initiateRetreat(attackingArmyId);
      }
    } else {
      const defendingArmyStrength = battleState.defendingArmy?.strength ?? 0;
      const lossAmount = Math.ceil(defendingArmyStrength / 5);

      const attackingArmyCurrentStrength = battleState.attackingArmy?.strength ?? 0;
      const newAttackingStrength = attackingArmyCurrentStrength - lossAmount;

      if (newAttackingStrength <= 0) {
        this.gameState.removeArmy(attackingArmyId);
      } else {
        this.gameState.updateArmyStrength(attackingArmyId, newAttackingStrength);
      }

      const newDefendingStrength = defendingArmyStrength - lossAmount;

      if (newDefendingStrength <= 0) {
        this.gameState.removeArmy(defendingArmyId);
      } else {
        this.gameState.updateArmyStrength(defendingArmyId, newDefendingStrength);
      }
    }

    this.gameState.endBattle();
  }

  private initiateRetreat(armyId: string): void {
    const army = this.gameState.armies().find((a) => a.id === armyId);
    console.log('army:', army);
    if (!army || army.positionHistory.length <= 1) {
      return; // No previous position to retreat to
    }

    // Loop through position history backwards (retreating step by step)
    for (let i = 1; i < army.positionHistory.length; i++) {
      const retreatPosition = army.positionHistory[i];
      console.log('retreatPosition:', retreatPosition);

      // Move to this retreat position
      this.gameState.moveArmy(armyId, retreatPosition);

      // Check if there's an enemy army at this retreat position
      const enemyAtRetreatPosition = this.gameState
        .armies()
        .find((a) => a.id !== armyId && a.position === retreatPosition && a.owner !== army.owner);
      console.log('enemyAtRetreatPosition:', enemyAtRetreatPosition);

      if (enemyAtRetreatPosition) {
        // Battle at retreat position - stop retreating and fight
        this.initiateArmyBattle(armyId, enemyAtRetreatPosition.id);
        return; // Exit the retreat loop since a battle occurred
      }
    }
  }
}
