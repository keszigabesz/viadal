import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DiceService {
  rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  rollMultipleDice(count: number): number[] {
    return Array.from({ length: count }, () => this.rollDie());
  }

  rollAndSum(count: number): number {
    return this.rollMultipleDice(count).reduce((sum, roll) => sum + roll, 0);
  }
}
