import { registry } from '../../core/registry.js';

const TREE = {
  root: 1,
  nodes: [
    { id: 1, value: 1, left: 2, right: 3 },
    { id: 2, value: 2, left: 4, right: 5 },
    { id: 3, value: 3, left: null, right: 6 },
    { id: 4, value: 4, left: 7, right: null },
    { id: 5, value: 5, left: null, right: null },
    { id: 6, value: 6, left: null, right: null },
    { id: 7, value: 7, left: null, right: null },
  ]
};

const entry = {
  id: 'ch4-levelorder',
  name: '层次遍历',
  nameEn: 'Level-order Traversal',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: '层次遍历(Level-order)按层从左到右逐个访问结点，本质上是BFS(广度优先搜索)在树上的应用。使用队列实现：根结点入队，然后循环执行——出队一个结点并访问，将其左右孩子(非空)依次入队。考研重点：层次遍历可用来判断完全二叉树、求树的宽度等。',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(w)', stable: '—' },
  keyPoints: ['使用队列（FIFO）实现', '逐层从左到右访问', '空间复杂度O(w)，w为树的最大宽度', '本质是BFS在树上的应用'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `// 层次遍历：借助队列，逐层从左到右访问
void levelOrder(BiTree T) {
    Queue Q;
    InitQueue(Q);             // 初始化队列
    if (T != NULL)
        EnQueue(Q, T);        // 根结点入队
    while (!IsEmpty(Q)) {     // 队列非空则循环
        DeQueue(Q, T);        // 出队一个结点
        visit(T);             // 访问该结点
        if (T->lchild != NULL)
            EnQueue(Q, T->lchild);  // 左孩子入队
        if (T->rchild != NULL)
            EnQueue(Q, T->rchild);  // 右孩子入队
    }
}`,
  generateSteps() {
    const treeData = JSON.parse(JSON.stringify(TREE));
    const steps = [];
    const visited = [];
    const result = [];
    const queue = [];

    const root = treeData.nodes.find(n => n.id === treeData.root);
    queue.push(root.id);
    steps.push({ line: 6, phase: '入队', description: `根结点 ${root.value} 入队`, data: { tree: treeData, traversal: '层次: ' }, highlights: { current: root.id } });

    while (queue.length > 0) {
      const id = queue.shift();
      const node = treeData.nodes.find(n => n.id === id);
      result.push(node.value);
      visited.push(id);
      steps.push({ line: 9, phase: '访问', description: `出队并访问 ${node.value}，序列 [${result.join(',')}]`, data: { tree: treeData, traversal: `层次: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });

      if (node.left) {
        const leftNode = treeData.nodes.find(n => n.id === node.left);
        queue.push(node.left);
        steps.push({ line: 11, phase: '左孩子入队', description: `左孩子 ${leftNode.value} 入队`, data: { tree: treeData, traversal: `层次: ${result.join(' → ')}` }, highlights: { active: [node.left], visited: [...visited] } });
      }
      if (node.right) {
        const rightNode = treeData.nodes.find(n => n.id === node.right);
        queue.push(node.right);
        steps.push({ line: 13, phase: '右孩子入队', description: `右孩子 ${rightNode.value} 入队`, data: { tree: treeData, traversal: `层次: ${result.join(' → ')}` }, highlights: { active: [node.right], visited: [...visited] } });
      }
    }

    steps.push({ line: 15, phase: '完成', description: `层次遍历结果：${result.join(' → ')}`, data: { tree: treeData, traversal: `层次: ${result.join(' → ')}` }, highlights: { sorted: visited } });
    return steps;
  }
};

registry.register(entry);
export default entry;
