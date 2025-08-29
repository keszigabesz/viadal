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
      x: 323,
      y: 196
    }
  },
  {
    id: 'c2',
    name: 'Pest',
    owner: 'ott',
    position: {
      x: 425,
      y: 214
    }
  },
  {
    id: 'c3',
    name: 'Szolnok',
    owner: 'hun',
    position: {
      x: 1399,
      y: 814
    }
  }
];