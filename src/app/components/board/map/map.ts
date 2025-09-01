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
    this.gameState.selectArmy(armyId);
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
