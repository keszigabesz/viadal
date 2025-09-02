import { Injectable, inject } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private gameState = inject(GameStateService);

  canAttackArmy(attackingArmyId: string, defendingArmyId: string): boolean {
    const attackingArmy = this.gameState.armies().find(army => army.id === attackingArmyId);
    const defendingArmy = this.gameState.armies().find(army => army.id === defendingArmyId);
    
    return attackingArmy?.owner !== defendingArmy?.owner;
  }

  initiateArmyBattle(attackingArmyId: string, defendingArmyId: string): void {
    console.log(`Initiating attack from ${attackingArmyId} to ${defendingArmyId}`);
    this.gameState.startBattle(attackingArmyId, defendingArmyId);
    // TODO: Implement battle logic
  }

  canSiegeCastle(armyId: string, castleId: string): boolean {
    const army = this.gameState.armies().find(a => a.id === armyId);
    const castle = this.gameState.castles().find(c => c.id === castleId);
    const armyAtCastle = this.gameState.armies().find(a => a.position === castleId);
    
    return !armyAtCastle && castle?.owner !== army?.owner;
  }

  commenceSiege(armyId: string, castleId: string): void {
    console.log(`Siege commenced by ${armyId} against castle ${castleId}`);
    // TODO: Implement siege logic
  }
}