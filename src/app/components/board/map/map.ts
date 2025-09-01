import { Component, computed, inject } from '@angular/core';
import { FIELDS, Field } from '@data/fields';
import { MAP_LAYOUT } from '@/data/map-layout';
import { ArmyService } from '@/app/services/army.service';
import { GameStateService } from '@/app/services/game-state.service';
import { Army } from '@components/army/army';
import { MovementService } from '@/app/services/movement.service';

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

  armies = this.gameState.armies;
  castles = this.gameState.castles;
  selectedArmyId = computed(() => this.gameState.selectedArmyId());

  getArmyPosition(positionId: string) {
    return this.armyService.getArmyPosition(positionId);
  }

  selectArmy(armyId: string) {
  const currentSelectedId = this.gameState.selectedArmyId();
  
  // If no army is currently selected, select this army
  if (!currentSelectedId) {
    this.gameState.selectArmy(armyId);
    return;
  }
  
  // If an army is already selected and we click on a different army
  if (currentSelectedId !== armyId) {
    const clickedArmy = this.armies().find(army => army.id === armyId);
    const selectedArmy = this.armies().find(army => army.id === currentSelectedId);
    
    if (clickedArmy && selectedArmy) {
      // Check if the clicked army's position is a valid neighbor
      if (this.movementService.isValidMove(selectedArmy.position, clickedArmy.position)) {
        // Check if it's an enemy army (attack) or friendly army (move)
        if (clickedArmy.owner !== selectedArmy.owner) {
          // TODO: Initiate attack against enemy army
          console.log(`Initiating attack from ${selectedArmy.id} to ${clickedArmy.id}`);
          // this.gameState.initiateAttack(selectedArmy.id, clickedArmy.id);
        } else {
          // Friendly army at target position, proceed with movement
          this.moveSelectedArmy(clickedArmy.position);
        }
      } else {
        // Not a valid move, just select the clicked army
        this.gameState.selectArmy(armyId);
      }
    }
  } else {
    // Clicking on the same army - you might want to deselect or keep selected
    this.gameState.deselectArmy();
    // Currently keeping it selected, but you could add deselection logic here
  }
}

  onPositionClick(positionId: string): void {
    const currentSelectedId = this.gameState.selectedArmyId();
    if (currentSelectedId && this.isNeighbor(positionId)) {
      this.moveSelectedArmy(positionId);
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
}
