import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch5-topo-sort',
  name: '拓扑排序',
  nameEn: 'Topological Sort',
  chapter: 'ch5-graph',
  chapterName: '图',
  description: '拓扑排序是对有向无环图(DAG)的顶点排成线性序列，使得对每条边(u,v)，u排在v前面。算法：①找入度为0的顶点输出；②删除该顶点及出边；③重复直到所有顶点输出或发现环。考研重点：判断DAG是否有环(能否输出所有顶点)、求拓扑排序序列、AOV网的应用。',
  complexity: { time: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' }, space: 'O(V)', stable: '—' },
  keyPoints: ['只能对DAG进行拓扑排序', '可用于判断有向图是否有环', '考研重点：手动执行拓扑排序', 'AOV网的应用'],
  rendererType: 'graph',
  defaultData: null,
  sourceCode: `bool TopologicalSort(Graph G) {
    InitStack(S);
    for (int i = 0; i < G.vexnum; i++)
        if (indegree[i] == 0) Push(S, i);
    int count = 0;
    while (!IsEmpty(S)) {
        int v; Pop(S, v);
        visit(v); count++;
        for (int w = FirstNeighbor(G, v); w >= 0;
             w = NextNeighbor(G, v, w)) {
            if (--indegree[w] == 0)
                Push(S, w);
        }
    }
    return count == G.vexnum;
}`,
  generateSteps() {
    const graphData = {
      nodes: [
        { id: 0, label: 'A' }, { id: 1, label: 'B' }, { id: 2, label: 'C' },
        { id: 3, label: 'D' }, { id: 4, label: 'E' }, { id: 5, label: 'F' },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 },
        { from: 2, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 },
      ],
      directed: true,
      positions: {
        0: { x: 150, y: 100 }, 1: { x: 350, y: 80 }, 2: { x: 150, y: 250 },
        3: { x: 450, y: 200 }, 4: { x: 300, y: 350 }, 5: { x: 550, y: 350 },
      }
    };
    const steps = [];
    const indegree = [0, 1, 1, 2, 1, 2];
    const result = [];
    const stack = [];

    // Find initial zero-indegree nodes
    for (let i = 0; i < 6; i++) { if (indegree[i] === 0) stack.push(i); }
    steps.push({ line: 4, phase: '初始化', description: `入度：${indegree.join(',')}，零入度结点入栈：${stack.map(i => graphData.nodes[i].label).join(',')}`, data: { graph: graphData }, highlights: { active: stack } });

    while (stack.length > 0) {
      const v = stack.pop();
      result.push(graphData.nodes[v].label);
      steps.push({ line: 8, phase: '出栈', description: `出栈 ${graphData.nodes[v].label}，加入排序序列 [${result.join('→')}]`, data: { graph: graphData }, highlights: { current: v, sorted: result.map(l => graphData.nodes.findIndex(n => n.label === l)) } });

      const neighbors = graphData.edges.filter(e => e.from === v).map(e => e.to);
      for (const w of neighbors) {
        indegree[w]--;
        if (indegree[w] === 0) {
          stack.push(w);
          steps.push({ line: 12, phase: '入度减为0', description: `${graphData.nodes[w].label} 入度减为0，入栈`, data: { graph: graphData }, highlights: { active: [w] } });
        } else {
          steps.push({ line: 11, phase: '入度减1', description: `${graphData.nodes[w].label} 入度减为 ${indegree[w]}`, data: { graph: graphData }, highlights: { comparing: [w] } });
        }
      }
    }

    steps.push({ line: 16, phase: '完成', description: `拓扑排序结果：${result.join(' → ')}${result.length < 6 ? '（图中有环！）' : ''}`, data: { graph: graphData }, highlights: { sorted: graphData.nodes.map(n => n.id) } });
    return steps;
  }
};

registry.register(entry);
export default entry;
