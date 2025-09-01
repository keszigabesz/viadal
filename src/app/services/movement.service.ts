import { Injectable } from '@angular/core';
import { MAP_LAYOUT } from '@data/map-layout';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  isValidMove(fromPositionId: string, toPositionId: string): boolean {
    const currentPositionLayout = MAP_LAYOUT.find((layout) => layout.id === fromPositionId);
    if (!currentPositionLayout) return false;

    return currentPositionLayout.neighbors.includes(toPositionId);
  }

  getNeighbors(positionId: string): string[] {
    const positionLayout = MAP_LAYOUT.find((layout) => layout.id === positionId);
    return positionLayout?.neighbors || [];
  }
}
