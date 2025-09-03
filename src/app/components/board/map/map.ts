import { Component, computed, inject } from '@angular/core';
import { FIELDS, Field } from '@data/fields';
import { ArmyService } from '@/app/services/army.service';
import { GameStateService } from '@/app/services/game-state.service';
import { Army } from '@components/army/army';
import { MovementService } from '@/app/services/movement.service';
import { CombatService } from '@/app/services/combat.service';

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
  private combatService = inject(CombatService);

  armies = this.gameState.armies;
  castles = this.gameState.castles;
  selectedArmyId = computed(() => this.gameState.selectedArmyId());

  getArmyPosition(positionId: string) {
    return this.armyService.getArmyPosition(positionId);
  }

  selectArmy(armyId: string) {
    const currentSelectedId = this.gameState.selectedArmyId();
    if (!currentSelectedId) {
      this.gameState.selectArmy(armyId);
      return;
    }
    
    if (currentSelectedId !== armyId) {
      if (this.armyService.canInteractWithArmy(currentSelectedId, armyId)) {
        if (this.armyService.areSameOwner(currentSelectedId, armyId)) {
          // Move to ally position
          const targetArmy = this.armies().find(army => army.id === armyId);
          this.moveSelectedArmy(targetArmy!.position);
        } else {
          // Attack enemy army
          this.combatService.initiateArmyBattle(currentSelectedId, armyId);
        }
      } else {
        this.gameState.selectArmy(armyId);
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
    const selectedArmy = this.armies().find((army) => army.id === selectedId);
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
    if (this.combatService.canSiegeCastle(selectedArmyId, castle.id)) {
      this.combatService.commenceSiege(selectedArmyId, castle.id);
    } else {
      this.moveSelectedArmy(castle.id);
    }
  }
}
