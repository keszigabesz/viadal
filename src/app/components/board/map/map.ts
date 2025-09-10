import { Component, computed, inject } from '@angular/core';
import { FIELDS, Field } from '@data/fields';
import { ArmyService } from '@/app/services/army.service';
import { GameStateService } from '@/app/services/game-state.service';
import { Army } from '@components/army/army';
import { MovementService } from '@/app/services/movement.service';
import { BattleService } from '@/app/services/battle.service';
import { SiegeService } from '@/app/services/siege.service';

@Component({
  selector: 'app-map',
  imports: [Army],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map {
  fields: Field[] = FIELDS;

  private armyService = inject(ArmyService);
  private gameState = inject(GameStateService);
  private movementService = inject(MovementService);
  private battleService = inject(BattleService);
  private siegeService = inject(SiegeService);

  armies = this.gameState.armies;
  castles = this.gameState.castles;
  selectedArmyId = computed(() => this.gameState.selectedArmyId());
  isBattleOngoing = computed(() => this.gameState.isBattleOngoing());

  getArmyPosition(positionId: string, armyId?: string) {
    return this.armyService.getArmyPosition(positionId, armyId);
  }

  selectArmy(armyId: string) {
    // Don't allow army selection during battle
    if (this.isBattleOngoing()) {
      return;
    }

    const currentSelectedId = this.gameState.selectedArmyId();
    
    // If no army is currently selected, only allow selecting own armies
    if (!currentSelectedId) {
      const targetArmy = this.gameState.getArmyById(armyId);
      const currentPlayer = this.gameState.getCurrentPlayer();
      
      if (!targetArmy || targetArmy.owner !== currentPlayer) {
        // Don't select enemy armies when no army is selected
        return;
      }
      
      this.gameState.selectArmy(armyId);
      return;
    }
    
    // If an army is already selected, continue with existing logic
    if (currentSelectedId !== armyId) {
      if (this.armyService.canInteractWithArmy(currentSelectedId, armyId)) {
        if (this.armyService.areSameOwner(currentSelectedId, armyId)) {
          // Move to ally position
          const targetArmy = this.gameState.getArmyById(armyId);
          this.moveSelectedArmy(targetArmy!.position);
        } else {
          // Attack enemy army
          this.battleService.initiateArmyBattle(currentSelectedId, armyId);
        }
      } else {
        // Can only select own armies when switching selection
        const targetArmy = this.gameState.getArmyById(armyId);
        const currentPlayer = this.gameState.getCurrentPlayer();
        
        if (targetArmy && targetArmy.owner === currentPlayer) {
          this.gameState.selectArmy(armyId);
        }
      }
    } else {
      this.gameState.deselectArmy();
    }
  }

  onPositionClick(positionId: string): void {
    console.log(positionId);
    const currentSelectedId = this.gameState.selectedArmyId();
    if (currentSelectedId && this.isNeighbor(positionId)) {
      const targetCastle = this.castles().find((castle) => castle.id === positionId);
      if (targetCastle) {
        this.handleCastleClick(targetCastle, currentSelectedId);
      } else {
        this.moveSelectedArmy(positionId);
      }
    }
  }

  private isNeighbor(targetId: string): boolean {
    const selectedId = this.gameState.selectedArmyId();
    if (!selectedId) return false;
    
    const selectedArmy = this.gameState.getArmyById(selectedId);
    if (!selectedArmy) return false;

    return this.movementService.isValidMove(selectedArmy.position, targetId);
  }

  private moveSelectedArmy(newPositionId: string): void {
    const selectedId = this.gameState.selectedArmyId();
    if (selectedId) {
      this.gameState.moveArmy(selectedId, newPositionId);
    }
  }

  private handleCastleClick(castle: any, selectedArmyId: string): void {
    if (this.siegeService.canSiegeCastle(selectedArmyId, castle.id)) {
      this.siegeService.commenceSiege(selectedArmyId, castle.id);
    } else {
      this.moveSelectedArmy(castle.id);
    }
  }

  getBattlePosition(): { x: number; y: number } {
    const battleState = this.gameState.getBattleState();
    if (battleState.defendingArmy) {
      const basePosition = this.getArmyPosition(battleState.defendingArmy.position);
      // Position the battle image above the armies
      return {
        x: basePosition.x + 8, // Center horizontally over the armies
        y: basePosition.y  // Position above the armies
      };
    }
    return { x: 0, y: 0 };
  }
}
