import { Injectable, signal } from '@angular/core';
import { CASTLES, Castle } from '@data/castles';
import { STARTING_ARMIES, Army } from '@data/starting-armies';

export interface BattleState {
  isOngoing: boolean;
  attackingArmy: Army | null;
  defendingArmy: Army | null;
  isResolved: boolean;
  battleResult?: {
    outcome: string;
    attackerLosses: number;
    defenderLosses: number;
    originalAttackerStrength: number;
    originalDefenderStrength: number;
  };
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
    defendingArmy: null,
    isResolved: false
  });

  // Turn management
  turnNumber = signal<number>(1);
  currentPlayer = signal<'ott' | 'hun'>('ott'); // Ottoman goes first

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
      current.map((army) => {
        if (army.id === armyId) {
          // Check if the new position already exists in the history
          const existingIndex = army.positionHistory.indexOf(newPosition);
          
          let updatedHistory: string[];
          if (existingIndex !== -1) {
            // If position exists in history, restore history to that point
            updatedHistory = army.positionHistory.slice(existingIndex);
          } else {
            // If it's a new position, add to beginning and keep only last 5
            updatedHistory = [newPosition, ...army.positionHistory].slice(0, 5);
          }
          
          console.log('Moving army', armyId, 'from', army.position, 'to', newPosition);
          console.log('Updated position history:', updatedHistory);
          return { ...army, position: newPosition, positionHistory: updatedHistory };
        }
        return army;
      })
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
        defendingArmy,
        isResolved: false
      });
    }
  }

  markBattleAsResolved() {
    this.battleState.update(state => ({
      ...state,
      isResolved: true
    }));
  }

  setBattleResult(outcome: string, attackerLosses: number, defenderLosses: number, originalAttackerStrength: number, originalDefenderStrength: number) {
    this.battleState.update(state => ({
      ...state,
      battleResult: {
        outcome,
        attackerLosses,
        defenderLosses,
        originalAttackerStrength,
        originalDefenderStrength
      }
    }));
  }

  endBattle() {
    this.battleState.set({
      isOngoing: false,
      attackingArmy: null,
      defendingArmy: null,
      isResolved: false
    });
  }

  isBattleOngoing() {
    return this.battleState().isOngoing;
  }

  getBattleState() {
    return this.battleState();
  }

  // Turn methods
  endTurn() {
    this.currentPlayer.update(current => current === 'ott' ? 'hun' : 'ott');
    
    // Only increment turn number when Ottoman's turn ends (completing a full round)
    if (this.currentPlayer() === 'ott') {
      this.turnNumber.update(turn => turn + 1);
    }
    
    this.deselectArmy(); // Deselect any selected army when turn ends
  }

  getCurrentPlayer() {
    return this.currentPlayer();
  }

  getTurnNumber() {
    return this.turnNumber();
  }

  isPlayerTurn(player: 'ott' | 'hun') {
    return this.currentPlayer() === player;
  }

  getArmyById(armyId: string) {
    return this.armies().find(army => army.id === armyId) || null;
  }
}
