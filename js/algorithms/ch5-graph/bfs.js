import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch5-bfs',
  name: '广度优先搜索',
  nameEn: 'BFS',
  chapter: 'ch5-graph',
  chapterName: '图',
  description: '广度优先搜索(BFS)从起始顶点出发，先访问所有相邻顶点(第一层)，再访问相邻顶点的相邻顶点(第二层)，逐层向外扩展。使用队列实现。时间复杂度：邻接矩阵O(V²)，邻接表O(V+E)。应用：无权图最短路径、层序遍历、判断二分图。考研重点：手写BFS遍历序列，理解与DFS的区别。',
  complexity: { time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' }, space: 'O(V)', stable: '—' },
  keyPoints: ['使用队列实现', '可求最短路径（无权图）', 'BFS生成树', '层次遍历的本质就是BFS'],
  rendererType: 'graph',
  defaultData: null,
  sourceCode: `void BFS(Graph G, int v) {
    bool visited[MAX_VERTEX] = {false}; // 初始化访问数组
    Queue Q;
    InitQueue(Q);
    visited[v] = true;                  // 标记根顶点
    EnQueue(Q, v);                      // 根顶点入队
    while (!IsEmpty(Q)) {               // 队列非空则继续
        DeQueue(Q, v);                  // 出队
        visit(v);                       // 访问当前顶点
        for (int w = FirstNeighbor(G, v); w >= 0;
             w = NextNeighbor(G, v, w)) {
            if (!visited[w]) {          // 未访问的邻居
                visited[w] = true;      // 标记并入队
                EnQueue(Q, w);
            }
        }
    }
}`,
  generateSteps() {
    const graphData = {
      nodes: [
        { id: 0, label: 'A' }, { id: 1, label: 'B' }, { id: 2, label: 'C' },
        { id: 3, label: 'D' }, { id: 4, label: 'E' }, { id: 5, label: 'F' },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 },
        { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 },
      ],
      directed: false,
      positions: {
        0: { x: 200, y: 100 }, 1: { x: 380, y: 80 }, 2: { x: 200, y: 250 },
        3: { x: 520, y: 180 }, 4: { x: 380, y: 280 }, 5: { x: 560, y: 300 },
      }
    };
    const steps = [];
    const visited = [0];
    const queue = [0];
    const result = [];

    steps.push({ line: 5, phase: '开始', description: '从顶点 A 开始，入队', data: { graph: graphData }, highlights: { current: 0, visited: [0] } });

    while (queue.length > 0) {
      const v = queue.shift();
      result.push(graphData.nodes[v].label);
      steps.push({ line: 8, phase: '出队访问', description: `出队访问 ${graphData.nodes[v].label}，遍历序列：${result.join('→')}`, data: { graph: graphData }, highlights: { current: v, visited: [...visited] } });

      const neighbors = graphData.edges.filter(e => e.from === v || e.to === v).map(e => e.from === v ? e.to : e.from).sort();
      for (const w of neighbors) {
        if (!visited.includes(w)) {
          visited.push(w);
          queue.push(w);
          steps.push({ line: 13, phase: '入队', description: `发现 ${graphData.nodes[w].label}，标记并入队`, data: { graph: graphData }, highlights: { active: [w], visited: [...visited] } });
        }
      }
    }

    steps.push({ line: 18, phase: '完成', description: `BFS 遍历序列：${result.join(' → ')}`, data: { graph: graphData }, highlights: { sorted: visited } });
    return steps;
  }
};

registry.register(entry);
export default entry;
