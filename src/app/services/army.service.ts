import { Injectable, inject } from '@angular/core';
import { FIELDS } from '@data/fields';
import { GameStateService } from './game-state.service';
import { MovementService } from './movement.service';

@Injectable({
  providedIn: 'root'
})
export class ArmyService {
  private fields = FIELDS;
  private gameState = inject(GameStateService);  
  private movementService = inject(MovementService);

  getArmyPosition(positionId: string): { x: number; y: number } {
    // First check if it's a field
    const field = this.fields.find(f => f.id === positionId);
    if (field) {
      return { 
        x: field.position.x - 11, 
        y: field.position.y - 11 
      };
    }
    
    // Then check if it's a castle
    const castle = this.gameState.castles().find(c => c.id === positionId);
    if (castle) {
      return {
        x: castle.position.x + 20,
        y: castle.position.y + 15
      };
    }
    
    // Default fallback
    return { x: 0, y: 0 };
  }

  canInteractWithArmy(selectedArmyId: string, targetArmyId: string): boolean {
    const selectedArmy = this.gameState.armies().find(army => army.id === selectedArmyId);
    const targetArmy = this.gameState.armies().find(army => army.id === targetArmyId);
    
    if (!selectedArmy || !targetArmy) return false;
    
    return this.movementService.isValidMove(selectedArmy.position, targetArmy.position);
  }

  areSameOwner(armyId1: string, armyId2: string): boolean {
    const army1 = this.gameState.armies().find(army => army.id === armyId1);
    const army2 = this.gameState.armies().find(army => army.id === armyId2);
    
    return army1?.owner === army2?.owner;
  }
}