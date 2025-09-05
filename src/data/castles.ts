export interface Castle {
  id: string;
  name: string;
  owner: 'ott' | 'hun';
  position: {
    x: number;
    y: number;
  };
}

export const CASTLES: Castle[] = [
  {
    id: 'c1',
    name: 'Buda',
    owner: 'ott',
    position: {
      x: 214,
      y: 188
    }
  },
  {
    id: 'c2',
    name: 'Pest',
    owner: 'ott',
    position: {
      x: 316,
      y: 206
    }
  },
  {
    id: 'c3',
    name: 'Szolnok',
    owner: 'hun',
    position: {
      x: 1290,
      y: 806
    }
  }
];