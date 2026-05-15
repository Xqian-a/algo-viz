// Chapter definitions
export const CHAPTERS = [
  { id: 'ch1-linear-list', name: '线性表', icon: '📋', order: 1 },
  { id: 'ch2-stack-queue', name: '栈和队列', icon: '📦', order: 2 },
  { id: 'ch3-string', name: '串', icon: '🔤', order: 3 },
  { id: 'ch4-tree', name: '树与二叉树', icon: '🌳', order: 4 },
  { id: 'ch5-graph', name: '图', icon: '🕸️', order: 5 },
  { id: 'ch6-search', name: '查找', icon: '🔍', order: 6 },
  { id: 'ch7-sort', name: '排序', icon: '📊', order: 7 },
];

// Visualization colors
export const COLORS = {
  default: { fill: 'rgba(78, 124, 255, 0.5)', stroke: 'rgba(78, 124, 255, 0.8)', text: '#e8eaf0' },
  comparing: { fill: 'rgba(251, 191, 36, 0.6)', stroke: 'rgba(251, 191, 36, 0.9)', text: '#1a1a2e' },
  swapping: { fill: 'rgba(248, 113, 113, 0.7)', stroke: 'rgba(248, 113, 113, 1)', text: '#fff' },
  sorted: { fill: 'rgba(74, 222, 128, 0.5)', stroke: 'rgba(74, 222, 128, 0.8)', text: '#1a1a2e' },
  active: { fill: 'rgba(155, 125, 255, 0.6)', stroke: 'rgba(155, 125, 255, 0.9)', text: '#fff' },
  found: { fill: 'rgba(34, 211, 238, 0.6)', stroke: 'rgba(34, 211, 238, 0.9)', text: '#1a1a2e' },
  visited: { fill: 'rgba(74, 222, 128, 0.3)', stroke: 'rgba(74, 222, 128, 0.5)', text: '#e8eaf0' },
  current: { fill: 'rgba(251, 146, 60, 0.7)', stroke: 'rgba(251, 146, 60, 1)', text: '#fff' },
  muted: { fill: 'rgba(93, 99, 128, 0.3)', stroke: 'rgba(93, 99, 128, 0.5)', text: '#9ca3b8' },
  pointer: { fill: 'rgba(78, 124, 255, 0.8)', stroke: '#4e7cff', text: '#fff' },
};

// Speed settings
export const SPEED_MAP = {
  0.5: 1600,
  1: 800,
  2: 400,
  4: 200,
};

// Renderer types
export const RENDERER_TYPES = {
  ARRAY: 'array',
  LINKED_LIST: 'linked-list',
  STACK: 'stack',
  QUEUE: 'queue',
  TREE: 'tree',
  GRAPH: 'graph',
  HASH: 'hash',
  STRING: 'string',
};
