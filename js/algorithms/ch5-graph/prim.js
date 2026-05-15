import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch5-prim',
  name: 'Prim算法',
  nameEn: "Prim's MST",
  chapter: 'ch5-graph',
  chapterName: '图',
  description: 'Prim算法求最小生成树(MST)，从一个顶点开始逐步扩展。维护一个已选集合S，每次选取连接S和V-S的最小权边，将对应的顶点加入S。时间复杂度O(V²)，适合稠密图。考研重点：手算Prim构造MST的过程，注意与Dijkstra的区别——Prim比较的是边权，Dijkstra比较的是路径距离累加。',
  complexity: { time: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)' }, space: 'O(V)', stable: '—' },
  keyPoints: ['贪心策略：每次选最小权边', '类似Dijkstra，但比较的是边权而非路径和', '稠密图用Prim更优', '考研常考：手动构造MST'],
  rendererType: 'graph',
  defaultData: null,
  sourceCode: `void Prim(Graph G, int v0) {
    bool visited[MAX_VERTEX] = {false};
    int lowcost[MAX_VERTEX];
    for (int i = 0; i < G.vexnum; i++)
        lowcost[i] = G.arc[v0][i];
    visited[v0] = true;
    for (int i = 1; i < G.vexnum; i++) {
        int min = INFINITY, k = -1;
        for (int j = 0; j < G.vexnum; j++)
            if (!visited[j] && lowcost[j] < min)
                { min = lowcost[j]; k = j; }
        visited[k] = true;
        for (int j = 0; j < G.vexnum; j++)
            if (!visited[j] && G.arc[k][j] < lowcost[j])
                lowcost[j] = G.arc[k][j];
    }
}`,
  generateSteps() {
    const graphData = {
      nodes: [
        { id: 0, label: 'A' }, { id: 1, label: 'B' }, { id: 2, label: 'C' },
        { id: 3, label: 'D' }, { id: 4, label: 'E' },
      ],
      edges: [
        { from: 0, to: 1, weight: 6 }, { from: 0, to: 2, weight: 1 },
        { from: 0, to: 3, weight: 5 }, { from: 1, to: 2, weight: 5 },
        { from: 1, to: 4, weight: 3 }, { from: 2, to: 3, weight: 5 },
        { from: 2, to: 4, weight: 6 }, { from: 3, to: 4, weight: 2 },
      ],
      directed: false,
      positions: {
        0: { x: 200, y: 100 }, 1: { x: 400, y: 80 }, 2: { x: 300, y: 250 },
        3: { x: 150, y: 350 }, 4: { x: 480, y: 300 },
      }
    };
    const steps = [];
    const visited = [0];
    const mstEdges = [];

    steps.push({ line: 6, phase: '初始化', description: '从顶点 A 开始，lowcost: [∞, 6, 1, 5, ∞]', data: { graph: graphData }, highlights: { current: 0 } });

    // Pick C (weight 1)
    visited.push(2); mstEdges.push([0, 2]);
    steps.push({ line: 12, phase: '加入MST', description: '选最小边 A-C(1)，加入MST', data: { graph: graphData }, highlights: { current: 2, visited: [...visited], edges: mstEdges } });

    // Pick D (weight 5 from C)
    visited.push(3); mstEdges.push([2, 3]);
    steps.push({ line: 12, phase: '加入MST', description: '选最小边 C-D(5)，加入MST', data: { graph: graphData }, highlights: { current: 3, visited: [...visited], edges: mstEdges } });

    // Pick E (weight 2 from D)
    visited.push(4); mstEdges.push([3, 4]);
    steps.push({ line: 12, phase: '加入MST', description: '选最小边 D-E(2)，加入MST', data: { graph: graphData }, highlights: { current: 4, visited: [...visited], edges: mstEdges } });

    // Pick B (weight 3 from E)
    visited.push(1); mstEdges.push([1, 4]);
    steps.push({ line: 12, phase: '加入MST', description: '选最小边 E-B(3)，加入MST', data: { graph: graphData }, highlights: { current: 1, visited: [...visited], edges: mstEdges } });

    steps.push({ line: 16, phase: '完成', description: `MST 总权值: ${1 + 5 + 2 + 3} = 11`, data: { graph: graphData }, highlights: { sorted: visited, edges: mstEdges } });
    return steps;
  }
};

registry.register(entry);
export default entry;
