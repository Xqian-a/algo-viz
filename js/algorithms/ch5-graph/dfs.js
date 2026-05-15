import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch5-dfs',
  name: '深度优先搜索',
  nameEn: 'DFS',
  chapter: 'ch5-graph',
  chapterName: '图',
  description: '深度优先搜索(DFS)从起始顶点出发，沿着一条路径尽可能深地探索到底，再回溯到上一个分叉点继续探索。使用递归(隐式栈)或显式栈实现。时间复杂度：邻接矩阵O(V²)，邻接表O(V+E)。应用：判断连通性、求连通分量、拓扑排序、判断有向图是否有环。考研重点：手写DFS遍历序列和生成DFS树。',
  complexity: { time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' }, space: 'O(V)', stable: '—' },
  keyPoints: ['使用栈（递归调用栈）实现', '可用于判断连通性、拓扑排序', '邻接矩阵存储时O(V²)，邻接表O(V+E)', '生成DFS树/森林'],
  rendererType: 'graph',
  defaultData: null,
  sourceCode: `bool visited[MAX_VERTEX];               // 访问标记数组
void DFS(Graph G, int v) {
    visited[v] = true;                  // 标记已访问
    visit(v);                           // 访问当前顶点
    for (int w = FirstNeighbor(G, v); w >= 0;  // 遍历所有邻接顶点
         w = NextNeighbor(G, v, w)) {
        if (!visited[w]) {
            DFS(G, w);                  // 未访问则递归DFS
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
    const visited = [];
    const result = [];

    function dfs(v) {
      visited.push(v);
      result.push(graphData.nodes[v].label);
      steps.push({ line: 3, phase: '访问', description: `访问顶点 ${graphData.nodes[v].label}，标记已访问`, data: { graph: graphData }, highlights: { current: v, visited: [...visited] } });

      const neighbors = graphData.edges.filter(e => e.from === v || e.to === v).map(e => e.from === v ? e.to : e.from).sort();
      for (const w of neighbors) {
        if (!visited.includes(w)) {
          steps.push({ line: 6, phase: '探索', description: `从 ${graphData.nodes[v].label} 探索到 ${graphData.nodes[w].label}，递归访问`, data: { graph: graphData }, highlights: { active: [v, w], visited: [...visited] } });
          dfs(w);
        }
      }
    }

    steps.push({ line: 2, phase: '开始', description: '从顶点 A 开始 DFS 遍历', data: { graph: graphData }, highlights: { current: 0 } });
    dfs(0);
    steps.push({ line: 9, phase: '完成', description: `DFS 遍历序列：${result.join(' → ')}`, data: { graph: graphData }, highlights: { sorted: visited } });
    return steps;
  }
};

registry.register(entry);
export default entry;
