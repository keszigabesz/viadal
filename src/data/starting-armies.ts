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
    position: 'f21',
    positionHistory: ['f21', 'f20', 'f19', 'f18', 'f17'],
  },
  {
    id: 'army2',
    owner: 'hun',
    strength: 15,
    position: 'f22',
    positionHistory: ['f22'],
  },
];
