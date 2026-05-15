import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch5-kruskal',
  name: 'Kruskal算法',
  nameEn: "Kruskal's MST",
  chapter: 'ch5-graph',
  chapterName: '图',
  description: 'Kruskal算法求最小生成树(MST)，按边权从小到大依次考虑每条边。如果加入该边不会形成环(两个端点不在同一个连通分量中)，则加入MST。使用并查集判断是否形成环。时间复杂度O(ElogE)（主要是排序），适合稀疏图。考研重点：手算Kruskal构造过程，理解并查集的使用。',
  complexity: { time: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' }, space: 'O(E)', stable: '—' },
  keyPoints: ['适合稀疏图', '使用并查集判断是否形成回路', '边排序O(ElogE)是主要开销', '与Prim对比：Prim适合稠密图'],
  rendererType: 'graph',
  defaultData: null,
  sourceCode: `void Kruskal(Graph G) {
    Sort edges by weight;
    InitUnionFind(G.vexnum);
    int count = 0;
    for (int i = 0; i < G.arcnum && count < G.vexnum - 1; i++) {
        int u = Find(edges[i].u);
        int v = Find(edges[i].v);
        if (u != v) {
            Union(u, v);
            add to MST;
            count++;
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
        { from: 0, to: 2, weight: 1 }, { from: 3, to: 4, weight: 2 },
        { from: 1, to: 4, weight: 3 }, { from: 0, to: 3, weight: 5 },
        { from: 1, to: 2, weight: 5 }, { from: 2, to: 3, weight: 5 },
        { from: 0, to: 1, weight: 6 }, { from: 2, to: 4, weight: 6 },
      ],
      directed: false,
      positions: {
        0: { x: 200, y: 100 }, 1: { x: 400, y: 80 }, 2: { x: 300, y: 250 },
        3: { x: 150, y: 350 }, 4: { x: 480, y: 300 },
      }
    };
    const steps = [];
    const mstEdges = [];
    const sortedEdges = [...graphData.edges].sort((a, b) => a.weight - b.weight);
    const parent = [0, 1, 2, 3, 4];

    function find(x) { return parent[x] === x ? x : find(parent[x]); }

    steps.push({ line: 2, phase: '排序', description: `边按权值排序：${sortedEdges.map(e => `${graphData.nodes[e.from].label}-${graphData.nodes[e.to].label}(${e.weight})`).join(', ')}`, data: { graph: graphData }, highlights: {} });

    for (const edge of sortedEdges) {
      if (mstEdges.length >= graphData.nodes.length - 1) break;
      const u = find(edge.from), v = find(edge.to);
      const uLabel = graphData.nodes[edge.from].label, vLabel = graphData.nodes[edge.to].label;

      if (u !== v) {
        parent[u] = v;
        mstEdges.push([edge.from, edge.to]);
        steps.push({ line: 9, phase: '加入MST', description: `边 ${uLabel}-${vLabel}(${edge.weight}) 不构成回路，加入MST`, data: { graph: graphData }, highlights: { found: [edge.from, edge.to], edges: mstEdges } });
      } else {
        steps.push({ line: 7, phase: '跳过', description: `边 ${uLabel}-${vLabel}(${edge.weight}) 会构成回路，跳过`, data: { graph: graphData }, highlights: { comparing: [edge.from, edge.to], edges: mstEdges } });
      }
    }

    steps.push({ line: 13, phase: '完成', description: `Kruskal MST 构造完成，总权值: ${mstEdges.reduce((s, [a, b]) => s + graphData.edges.find(e => (e.from === a && e.to === b) || (e.from === b && e.to === a)).weight, 0)}`, data: { graph: graphData }, highlights: { sorted: graphData.nodes.map(n => n.id), edges: mstEdges } });
    return steps;
  }
};

registry.register(entry);
export default entry;
