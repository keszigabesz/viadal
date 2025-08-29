export interface Army {
  id: string;
  owner: 'ott' | 'hun';
  strength: number;
  position: string; // id from fields or castles
}

export const STARTING_ARMIES: Army[] = [
  {
    id: 'army1',
    owner: 'ott',
    strength: 30,
    position: 'c1'
  },
  {
    id: 'army2',
    owner: 'hun',
    strength: 15,
    position: 'f22'
  }
];