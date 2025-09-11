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
    
    // Check if castle is already under siege
    if (this.gameState.isCastleUnderSiege(castleId)) {
      return false;
    }
    
    // Check if army is already sieging another castle
    if (this.gameState.isArmySieging(armyId)) {
      return false;
    }
    
    const armyAtCastle = this.gameState.armies().find((a) => a.position === castleId);

    return !armyAtCastle && castle?.owner !== army?.owner;
  }

  commenceSiege(armyId: string, castleId: string): string {
    const siegeId = this.gameState.startSiege(armyId, castleId);
    console.log(`Siege commenced: ${siegeId} by army ${armyId} against castle ${castleId}`);
    return siegeId;
  }

  endSiege(siegeId: string): void {
    this.gameState.endSiege(siegeId);
    console.log(`Siege ended: ${siegeId}`);
  }

  getSiegeByArmy(armyId: string) {
    return this.gameState.getSiegeByArmyId(armyId);
  }

  getSiegeByCastle(castleId: string) {
    return this.gameState.getSiegeByCastleId(castleId);
  }

  getAllActiveSieges() {
    return this.gameState.getActiveSieges();
  }
}