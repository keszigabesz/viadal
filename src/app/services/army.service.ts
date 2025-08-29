import { Injectable, inject } from '@angular/core';
import { FIELDS } from '@data/fields';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class ArmyService {
  private fields = FIELDS;
  private gameState = inject(GameStateService);

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
}