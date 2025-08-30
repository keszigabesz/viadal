import { Component, inject } from '@angular/core';
import { FIELDS, Field } from '@data/fields';
import { ArmyService } from '@/app/services/army.service';
import { GameStateService } from '@/app/services/game-state.service';
import { Army } from '@components/army/army';

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

  armies = this.gameState.armies;
  castles = this.gameState.castles;

  getArmyPosition(positionId: string) {
    return this.armyService.getArmyPosition(positionId);
  }

  selectArmy(armyId: string) {
    this.gameState.selectArmy(armyId);
    console.log(this.gameState.getSelectedArmy());
  }
}
