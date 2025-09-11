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
    const currentSelectedId = this.gameState.selectedArmyId();
    
    if (currentSelectedId) {
      // If clicking on the same army that's already selected, deselect it
      if (currentSelectedId === armyId) {
        this.gameState.deselectArmy();
        return;
      }
      
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
      // No army currently selected, select this one if it belongs to current player
      const targetArmy = this.gameState.getArmyById(armyId);
      const currentPlayer = this.gameState.getCurrentPlayer();
      
      if (targetArmy && targetArmy.owner === currentPlayer) {
        this.gameState.selectArmy(armyId);
      }
    }
  }

  onPositionClick(positionId: string): void {
    console.log(positionId);
    const currentSelectedId = this.gameState.selectedArmyId();
    if (currentSelectedId && this.isNeighbor(positionId) && this.gameState.canArmyMove(currentSelectedId)) {
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
    if (selectedId && this.gameState.canArmyMove(selectedId)) {
      this.gameState.moveArmy(selectedId, newPositionId);
      
      // Check if army has no movement points left after the move
      const army = this.gameState.getArmyById(selectedId);
      if (army && army.movementPoints <= 0) {
        this.gameState.deselectArmy();
      }
    }
  }

  private handleCastleClick(castle: any, selectedArmyId: string): void {
    if (this.siegeService.canSiegeCastle(selectedArmyId, castle.id)) {
      // Move the army to the castle position first
      this.moveSelectedArmy(castle.id);
      // Then commence the siege
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

  isCastleUnderSiege(castleId: string): boolean {
    return this.gameState.isCastleUnderSiege(castleId);
  }
}
