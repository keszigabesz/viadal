import { Injectable, signal } from '@angular/core';
import { CASTLES, Castle } from '@data/castles';
import { STARTING_ARMIES, Army } from '@data/starting-armies';

export interface BattleState {
  isOngoing: boolean;
  attackingArmy: Army | null;
  defendingArmy: Army | null;
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  castles = signal<Castle[]>(CASTLES);
  armies = signal<Army[]>(STARTING_ARMIES);
  selectedArmyId = signal<string | null>(null);
  battleState = signal<BattleState>({
    isOngoing: false,
    attackingArmy: null,
    defendingArmy: null
  });

  // Castle methods
  changeCastleOwner(castleId: string, newOwner: 'ott' | 'hun') {
    this.castles.update((current) =>
      current.map((castle) => (castle.id === castleId ? { ...castle, owner: newOwner } : castle))
    );
  }

  // Army methods
  addArmy(army: Army) {
    this.armies.update((current) => [...current, army]);
  }

  removeArmy(armyId: string) {
    this.armies.update((current) => current.filter((army) => army.id !== armyId));
  }

  updateArmyStrength(armyId: string, newStrength: number) {
    this.armies.update((current) =>
      current.map((army) => (army.id === armyId ? { ...army, strength: newStrength } : army))
    );
  }

  moveArmy(armyId: string, newPosition: string) {
    this.armies.update((current) =>
      current.map((army) => (army.id === armyId ? { ...army, position: newPosition } : army))
    );
  }

  // Army selection methods
  selectArmy(armyId: string | null) {
    this.selectedArmyId.set(armyId);
  }

  deselectArmy() {
    this.selectedArmyId.set(null);
  }

  getSelectedArmy() {
    const selectedId = this.selectedArmyId();
    if (!selectedId) return null;
    return this.armies().find((army) => army.id === selectedId) || null;
  }

  // Battle methods
  startBattle(attackingArmyId: string, defendingArmyId: string) {
    const attackingArmy = this.armies().find(army => army.id === attackingArmyId);
    const defendingArmy = this.armies().find(army => army.id === defendingArmyId);
    
    this.deselectArmy();
    
    if (attackingArmy && defendingArmy) {
      this.battleState.set({
        isOngoing: true,
        attackingArmy,
        defendingArmy
      });
    }
  }

  endBattle() {
    this.battleState.set({
      isOngoing: false,
      attackingArmy: null,
      defendingArmy: null
    });
  }

  isBattleOngoing() {
    return this.battleState().isOngoing;
  }

  getBattleState() {
    return this.battleState();
  }
}
