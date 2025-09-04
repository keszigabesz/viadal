import { Injectable } from '@angular/core';

export enum BattleOutcome {
  DECISIVE_VICTORY = 'decisive_victory',
  ATTACKER_WINS = 'attacker_wins',
  DEFENDER_WINS = 'defender_wins',
  MUTUAL_LOSSES = 'mutual_losses'
}

@Injectable({
  providedIn: 'root',
})
export class BattleCalculationService {
  
  calculateRatio(attackerStrength: number, defenderStrength: number): number {
    const rawRatio = attackerStrength / defenderStrength;
    let ratio = rawRatio >= 1 ? Math.floor(rawRatio) : Math.floor(rawRatio * 10) / 10;
    
    // Cap ratio at 5 for ratios 6, 7, 8, 9 (they follow the same rules as ratio 5)
    if (ratio >= 6 && ratio <= 9) {
      ratio = 5;
    }
    
    return ratio;
  }

  determineBattleOutcome(diceCast: number, ratio: number): BattleOutcome {
    const diceTimesRatio = diceCast * ratio;

    if (ratio >= 10) {
      return BattleOutcome.DECISIVE_VICTORY;
    } else if ((diceCast === 6 && ratio >= 0.5) || diceTimesRatio >= 10) {
      return BattleOutcome.ATTACKER_WINS;
    } else if (diceTimesRatio < 2 || (diceCast === 1 && ratio === 2) || ratio < 0.5) {
      return BattleOutcome.DEFENDER_WINS;
    } else {
      return BattleOutcome.MUTUAL_LOSSES;
    }
  }
}