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

  getArmyPosition(positionId: string, armyId?: string): { x: number; y: number } {
    // First check if it's a field
    const field = this.fields.find(f => f.id === positionId);
    if (field) {
      let basePosition = { 
        x: field.position.x - 11, 
        y: field.position.y - 11 
      };
      
      // If army ID is provided, check for other armies at same position
      if (armyId) {
        const armiesAtPosition = this.gameState.armies().filter(a => a.position === positionId);
        const armyIndex = armiesAtPosition.findIndex(a => a.id === armyId);
        
        // Offset armies side by side if multiple at same position
        if (armiesAtPosition.length > 1 && armyIndex >= 0) {
          basePosition.x += (armyIndex * 25); // Adjust spacing as needed
        }
      }
      
      return basePosition;
    }
    
    // Then check if it's a castle
    const castle = this.gameState.castles().find(c => c.id === positionId);
    if (castle) {
      let basePosition = {
        x: castle.position.x + 20,
        y: castle.position.y + 15
      };
      
      // If army ID is provided, check for other armies at same position
      if (armyId) {
        const armiesAtPosition = this.gameState.armies().filter(a => a.position === positionId);
        const armyIndex = armiesAtPosition.findIndex(a => a.id === armyId);
        
        // Offset armies side by side if multiple at same position
        if (armiesAtPosition.length > 1 && armyIndex >= 0) {
          basePosition.x += (armyIndex * 25); // Adjust spacing as needed
        }
      }
      
      return basePosition;
    }
    
    // Default fallback
    return { x: 0, y: 0 };
  }

  canInteractWithArmy(selectedArmyId: string, targetArmyId: string): boolean {
    const selectedArmy = this.gameState.getArmyById(selectedArmyId);
    const targetArmy = this.gameState.getArmyById(targetArmyId);
    
    if (!selectedArmy || !targetArmy) return false;
    
    // Check if selected army has movement points
    if (selectedArmy.movementPoints <= 0) return false;
    
    return this.movementService.isValidMove(selectedArmy.position, targetArmy.position);
  }

  // New method to check if army can move to a position
  canMoveToPosition(armyId: string, targetPosition: string): boolean {
    const army = this.gameState.getArmyById(armyId);
    
    if (!army || army.movementPoints <= 0) return false;
    
    return this.movementService.isValidMove(army.position, targetPosition);
  }

  areSameOwner(armyId1: string, armyId2: string): boolean {
    const army1 = this.gameState.getArmyById(armyId1);
    const army2 = this.gameState.getArmyById(armyId2);
    
    return army1?.owner === army2?.owner;
  }
}