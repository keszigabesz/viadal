import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';
import { DiceService } from './dice.service';

@Injectable({
  providedIn: 'root',
})
export class CombatService {
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
    const ratio = rawRatio >= 1 ? Math.floor(rawRatio) : Math.floor(rawRatio * 10) / 10;
    const diceTimesRatio = diceCast * ratio;

    console.log('Dice Cast:', diceCast);
    console.log('Strength Ratio:', ratio);
    console.log('Dice x Ratio:', diceTimesRatio);

    // Battle outcome logic

    if (ratio >= 10) {
      this.gameState.removeArmy(defendingArmyId);
      if (battleState.defendingArmy?.position) {
        this.gameState.moveArmy(attackingArmyId, battleState.defendingArmy.position);
      }
    } else if ((diceCast === 6 && ratio >= 0.5) || diceTimesRatio >= 10) {
      //attacker wins';
    } else if (diceTimesRatio < 2 || (diceCast === 1 && ratio === 2) || ratio < 0.5) {
      //'defender wins';
    } else {
      //'draw';
    }

    this.gameState.endBattle();
  }

  canSiegeCastle(armyId: string, castleId: string): boolean {
    const army = this.gameState.armies().find((a) => a.id === armyId);
    const castle = this.gameState.castles().find((c) => c.id === castleId);
    const armyAtCastle = this.gameState.armies().find((a) => a.position === castleId);

    return !armyAtCastle && castle?.owner !== army?.owner;
  }

  commenceSiege(armyId: string, castleId: string): void {
    console.log(`Siege commenced by ${armyId} against castle ${castleId}`);
    // TODO: Implement siege logic
  }
}
