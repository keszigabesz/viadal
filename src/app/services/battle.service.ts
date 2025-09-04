import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { DiceService } from './dice.service';
import { BattleCalculationService, BattleOutcome } from './battle-calculation.service';
import { BattleResolutionService } from './battle-resolution.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  private gameState = inject(GameStateService);
  private diceService = inject(DiceService);
  private battleCalculation = inject(BattleCalculationService);
  private battleResolution = inject(BattleResolutionService);

  canAttackArmy(attackingArmyId: string, defendingArmyId: string): boolean {
    const attackingArmy = this.gameState.armies().find((army) => army.id === attackingArmyId);
    const defendingArmy = this.gameState.armies().find((army) => army.id === defendingArmyId);

    return attackingArmy?.owner !== defendingArmy?.owner;
  }

  initiateArmyBattle(attackingArmyId: string, defendingArmyId: string): void {
    this.gameState.startBattle(attackingArmyId, defendingArmyId);

    const battleState = this.gameState.getBattleState();
    const diceCast = this.diceService.rollDie();
    
    const ratio = this.battleCalculation.calculateRatio(
      battleState.attackingArmy?.strength ?? 1,
      battleState.defendingArmy?.strength ?? 1
    );

    const outcome = this.battleCalculation.determineBattleOutcome(diceCast, ratio);
    
    this.resolveBattle(outcome, attackingArmyId, defendingArmyId);
    this.gameState.endBattle();
  }

  private resolveBattle(outcome: BattleOutcome, attackingArmyId: string, defendingArmyId: string): void {
    switch (outcome) {
      case BattleOutcome.DECISIVE_VICTORY:
        this.battleResolution.resolveDecisiveVictory(attackingArmyId, defendingArmyId);
        break;

      case BattleOutcome.ATTACKER_WINS:
        const defenderToRetreat = this.battleResolution.resolveAttackerWins(attackingArmyId, defendingArmyId);
        if (defenderToRetreat) {
          this.initiateRetreat(defenderToRetreat);
        }
        break;

      case BattleOutcome.DEFENDER_WINS:
        const attackerToRetreat = this.battleResolution.resolveDefenderWins(attackingArmyId, defendingArmyId);
        if (attackerToRetreat) {
          this.initiateRetreat(attackerToRetreat);
        }
        break;

      case BattleOutcome.MUTUAL_LOSSES:
        const { attackerRetreat, defenderRetreat } = this.battleResolution.resolveMutualLosses(attackingArmyId, defendingArmyId);
        if (attackerRetreat) {
          this.initiateRetreat(attackerRetreat);
        }
        if (defenderRetreat) {
          this.initiateRetreat(defenderRetreat);
        }
        break;
    }
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
