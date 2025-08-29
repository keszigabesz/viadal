export interface MapLayout {
  id: string;
  neighbors: string[];
}

export const MAP_LAYOUT: MapLayout[] = [
  // Castles
  {
    id: 'c1',
    neighbors: ['f1', 'c2']
  },
  {
    id: 'c2',
    neighbors: ['f7', 'c1']
  },
  {
    id: 'c3',
    neighbors: ['f21','f26']
  },
  {
    id: 'f1',
    neighbors: ['c1', 'f2']
  },
  {
    id: 'f2',
    neighbors: ['f1', 'f3']
  },
  {
    id: 'f3',
    neighbors: ['f2', 'f4']
  },
  {
    id: 'f4',
    neighbors: ['f3', 'f5']
  },
  {
    id: 'f5',
    neighbors: ['f4', 'f6']
  },
  {
    id: 'f6',
    neighbors: ['f5', 'f11']
  },
  {
    id: 'f7',
    neighbors: ['c2', 'f8']
  },
  {
    id: 'f8',
    neighbors: ['f7', 'f9']
  },
  {
    id: 'f9',
    neighbors: ['f8', 'f10']
  },
  {
    id: 'f10',
    neighbors: ['f9', 'f16']
  },
  {
    id: 'f11',
    neighbors: ['f6', 'f12']
  },
  {
    id: 'f12',
    neighbors: ['f11', 'f13']
  },
  {
    id: 'f13',
    neighbors: ['f12', 'f14']
  },
  {
    id: 'f14',
    neighbors: ['f13', 'f15']
  },
  {
    id: 'f15',
    neighbors: ['f14', 'f16']
  },
  {
    id: 'f16',
    neighbors: ['f10', 'f15', 'f17']
  },
  {
    id: 'f17',
    neighbors: ['f16', 'f18']
  },
  {
    id: 'f18',
    neighbors: ['f17', 'f19']
  },
  {
    id: 'f19',
    neighbors: ['f18', 'f20']
  },
  {
    id: 'f20',
    neighbors: ['f19', 'f21']
  },
  {
    id: 'f21',
    neighbors: ['f20', 'c3']
  },
  {
    id: 'f22',
    neighbors: ['f23']
  },
  {
    id: 'f23',
    neighbors: ['f22', 'f24']
  },
  {
    id: 'f24',
    neighbors: ['f23', 'f25']
  },
  {
    id: 'f25',
    neighbors: ['f24', 'f26']
  },
  {
    id: 'f26',
    neighbors: ['c3', 'f25']
  }
];