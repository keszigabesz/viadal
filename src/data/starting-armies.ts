export interface Army {
  id: string;
  owner: 'ott' | 'hun';
  strength: number;
  position: string;
  positionHistory: string[];
}

export const STARTING_ARMIES: Army[] = [
  {
    id: 'army1',
    owner: 'ott',
    strength: 30,
    position: 'f2',
    positionHistory: ['f2', 'f1', 'c1', 'c2', 'f7'],
  },
  {
    id: 'army2',
    owner: 'hun',
    strength: 15,
    position: 'f3',
    positionHistory: ['f3', 'f4', 'f5', 'f6', 'f11'],
  }
];