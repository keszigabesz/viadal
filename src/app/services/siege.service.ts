import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class SiegeService {
  private gameState = inject(GameStateService);

  canSiegeCastle(armyId: string, castleId: string): boolean {
    const army = this.gameState.getArmyById(armyId);
    const castle = this.gameState.castles().find((c) => c.id === castleId);
    const armyAtCastle = this.gameState.armies().find((a) => a.position === castleId);

    return !armyAtCastle && castle?.owner !== army?.owner;
  }

  commenceSiege(armyId: string, castleId: string): void {
    console.log(`Siege commenced by ${armyId} against castle ${castleId}`);
    // TODO: Implement siege logic
  }
}