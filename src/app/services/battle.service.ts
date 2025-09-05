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
  }

  executeBattleCalculation(attackingArmyId: string, defendingArmyId: string): void {
    const battleState = this.gameState.getBattleState();
    const originalAttackerStrength = battleState.attackingArmy?.strength ?? 0;
    const originalDefenderStrength = battleState.defendingArmy?.strength ?? 0;
    
    const diceCast = this.diceService.rollDie();
    
    const ratio = this.battleCalculation.calculateRatio(
      originalAttackerStrength,
      originalDefenderStrength
    );

    const outcome = this.battleCalculation.determineBattleOutcome(diceCast, ratio);
    
    this.resolveBattle(outcome, attackingArmyId, defendingArmyId, originalAttackerStrength, originalDefenderStrength);
    this.gameState.markBattleAsResolved();
  }

  private resolveBattle(outcome: BattleOutcome, attackingArmyId: string, defendingArmyId: string, originalAttackerStrength: number, originalDefenderStrength: number): void {
    let outcomeText = '';
    let attackerLosses = 0;
    let defenderLosses = 0;

    switch (outcome) {
      case BattleOutcome.DECISIVE_VICTORY:
        outcomeText = 'Döntő győzelem';
        defenderLosses = originalDefenderStrength;
        this.battleResolution.resolveDecisiveVictory(attackingArmyId, defendingArmyId);
        break;

      case BattleOutcome.ATTACKER_WINS:
        outcomeText = 'Támadó győzelme';
        defenderLosses = Math.ceil(originalDefenderStrength / 3);
        const defenderToRetreat = this.battleResolution.resolveAttackerWins(attackingArmyId, defendingArmyId);
        if (defenderToRetreat) {
          this.initiateRetreat(defenderToRetreat);
        }
        break;

      case BattleOutcome.DEFENDER_WINS:
        outcomeText = 'Védő győzelme';
        attackerLosses = Math.ceil(originalDefenderStrength / 3);
        const attackerToRetreat = this.battleResolution.resolveDefenderWins(attackingArmyId, defendingArmyId);
        if (attackerToRetreat) {
          this.initiateRetreat(attackerToRetreat);
        }
        break;

      case BattleOutcome.MUTUAL_LOSSES:
        outcomeText = 'Döntetlen';
        attackerLosses = Math.ceil(originalDefenderStrength / 5);
        defenderLosses = Math.ceil(originalDefenderStrength / 5);
        const { attackerRetreat, defenderRetreat } = this.battleResolution.resolveMutualLosses(attackingArmyId, defendingArmyId);
        if (attackerRetreat) {
          this.initiateRetreat(attackerRetreat);
        }
        if (defenderRetreat) {
          this.initiateRetreat(defenderRetreat);
        }
        break;
    }

    this.gameState.setBattleResult(outcomeText, attackerLosses, defenderLosses, originalAttackerStrength, originalDefenderStrength);
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
