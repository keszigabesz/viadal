export interface Castle {
  id: string;
  name: string;
  owner: 'ott' | 'hun';
  position: {
    x: number;
    y: number;
  };
  strength: number;
}

export const CASTLES: Castle[] = [
  {
    id: 'c1',
    name: 'Buda',
    owner: 'ott',
    position: {
      x: 214,
      y: 188
    },
    strength: 10
  },
  {
    id: 'c2',
    name: 'Pest',
    owner: 'ott',
    position: {
      x: 316,
      y: 206
    },
    strength: 5
  },
  {
    id: 'c3',
    name: 'Szolnok',
    owner: 'hun',
    position: {
      x: 1290,
      y: 806
    },
    strength: 3
  }
];