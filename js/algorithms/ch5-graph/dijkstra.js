import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch5-dijkstra',
  name: 'Dijkstra算法',
  nameEn: "Dijkstra's Algorithm",
  chapter: 'ch5-graph',
  chapterName: '图',
  description: 'Dijkstra算法求单源最短路径，适用于非负权图。核心思想是贪心：每次选取距离源点最近的未确定顶点，用它来"松弛"更新邻居的距离。时间复杂度O(V²)（朴素版），可用堆优化到O((V+E)logV)。考研重点：手算Dijkstra执行过程，填写dist和path数组。注意：不能处理负权边！',
  complexity: { time: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)' }, space: 'O(V)', stable: '—' },
  keyPoints: ['不能处理负权边', '贪心策略：每次选最近的顶点', '考研常考：手动模拟执行过程', '与Prim算法的区别：Dijkstra累加距离，Prim比较权值'],
  rendererType: 'graph',
  defaultData: null,
  sourceCode: `void Dijkstra(Graph G, int v0, int dist[], int path[]) {
    bool visited[MAX_VERTEX] = {false};
    for (int i = 0; i < G.vexnum; i++) {       // 初始化距离数组
        dist[i] = G.arc[v0][i];
        if (G.arc[v0][i] < INFINITY) path[i] = v0;
    }
    visited[v0] = true; dist[v0] = 0;          // 源点到自身距离为0
    for (int i = 1; i < G.vexnum; i++) {
        int min = INFINITY, u = -1;
        for (int j = 0; j < G.vexnum; j++)     // 选距离最小的未访问顶点
            if (!visited[j] && dist[j] < min)
                { min = dist[j]; u = j; }
        visited[u] = true;                      // 标记已确定最短路径
        for (int w = 0; w < G.vexnum; w++)      // 松弛操作：更新邻居距离
            if (!visited[w] && dist[u] + G.arc[u][w] < dist[w]) {
                dist[w] = dist[u] + G.arc[u][w];
                path[w] = u;
            }
    }
}`,
  generateSteps() {
    const graphData = {
      nodes: [
        { id: 0, label: 'A' }, { id: 1, label: 'B' }, { id: 2, label: 'C' },
        { id: 3, label: 'D' }, { id: 4, label: 'E' },
      ],
      edges: [
        { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
        { from: 1, to: 3, weight: 3 }, { from: 2, to: 1, weight: 1 },
        { from: 2, to: 3, weight: 5 }, { from: 3, to: 4, weight: 1 },
      ],
      directed: true,
      positions: {
        0: { x: 150, y: 200 }, 1: { x: 350, y: 100 }, 2: { x: 350, y: 300 },
        3: { x: 550, y: 200 }, 4: { x: 700, y: 200 },
      }
    };
    const steps = [];
    const dist = [0, 4, 2, Infinity, Infinity];
    const visited = [];
    const edges = [];

    steps.push({ line: 1, phase: '初始化', description: '从源点 A 开始，初始化 dist: [0, 4, 2, ∞, ∞]', data: { graph: graphData }, highlights: { current: 0 } });

    // Step 1: Pick A (dist=0)
    visited.push(0);
    steps.push({ line: 10, phase: '选最近', description: `选 dist 最小的未访问顶点 A(0)，标记已确定`, data: { graph: graphData }, highlights: { current: 0, visited: [0] } });
    // Update neighbors of A: B(0+4=4), C(0+2=2)
    steps.push({ line: 14, phase: '松弛', description: `更新邻居：dist[B]=min(4,0+4)=4, dist[C]=min(2,0+2)=2`, data: { graph: graphData }, highlights: { active: [0, 1, 2], visited: [0] } });

    // Step 2: Pick C (dist=2)
    visited.push(2);
    dist[1] = 3; dist[3] = 7;
    edges.push([2, 1]);
    steps.push({ line: 10, phase: '选最近', description: `选 C(dist=2)，更新邻居：dist[B]=min(4,2+1)=3, dist[D]=min(∞,2+5)=7`, data: { graph: graphData }, highlights: { current: 2, visited: [0, 2], edges: [...edges] } });

    // Step 3: Pick B (dist=3)
    visited.push(1);
    dist[3] = 6;
    edges.push([1, 3]);
    steps.push({ line: 10, phase: '选最近', description: `选 B(dist=3)，更新邻居：dist[D]=min(7,3+3)=6`, data: { graph: graphData }, highlights: { current: 1, visited: [0, 2, 1], edges: [...edges] } });

    // Step 4: Pick D (dist=6)
    visited.push(3);
    dist[4] = 7;
    edges.push([3, 4]);
    steps.push({ line: 10, phase: '选最近', description: `选 D(dist=6)，更新邻居：dist[E]=min(∞,6+1)=7`, data: { graph: graphData }, highlights: { current: 3, visited: [0, 2, 1, 3], edges: [...edges] } });

    // Step 5: Pick E (dist=7)
    visited.push(4);
    steps.push({ line: 10, phase: '选最近', description: `选 E(dist=7)，无未访问邻居`, data: { graph: graphData }, highlights: { current: 4, visited: [0, 2, 1, 3, 4], edges: [...edges] } });

    steps.push({ line: 17, phase: '完成', description: `最短路径：A=0, B=3, C=2, D=6, E=7`, data: { graph: graphData }, highlights: { sorted: [0, 1, 2, 3, 4], edges: [...edges] } });
    return steps;
  }
};

registry.register(entry);
export default entry;
