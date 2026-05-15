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
  id: 'ch4-preorder',
  name: '前序遍历',
  nameEn: 'Preorder Traversal',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: '前序遍历(Preorder)的访问顺序是"根→左→右"：先访问根结点，再递归遍历左子树，最后递归遍历右子树。递归终止条件是T==NULL。应用场景：复制二叉树、获得前缀表达式。考研重点：由前序+中序序列可以唯一确定一棵二叉树（前序的第一个是根，在中序中找到根可划分左右子树）。',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)', stable: '—' },
  keyPoints: ['访问顺序：根→左→右', '递归终止条件：T == NULL', '可用于复制二叉树', '考研常考：由前序+中序构造二叉树'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `// 前序遍历：根 → 左 → 右
void preOrder(BiTree T) {
    if (T != NULL) {          // 递归终止条件
        visit(T);             // ① 先访问根结点
        preOrder(T->lchild);  // ② 递归遍历左子树
        preOrder(T->rchild);  // ③ 递归遍历右子树
    }
}`,
  generateSteps() {
    const treeData = JSON.parse(JSON.stringify(TREE));
    const steps = [];
    const visited = [];
    const result = [];

    function preorder(id) {
      if (!id) return;
      const node = treeData.nodes.find(n => n.id === id);
      if (!node) return;
      result.push(node.value);
      steps.push({ line: 4, phase: '访问', description: `visit(${node.value})：先访问根结点 ${node.value}，序列 [${result.join(',')}]`, data: { tree: treeData, traversal: `前序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      visited.push(id);
      steps.push({ line: 5, phase: '递归左', description: `递归进入左子树 preOrder(${node.left ?? 'NULL'})`, data: { tree: treeData, traversal: `前序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      preorder(node.left);
      steps.push({ line: 6, phase: '递归右', description: `递归进入右子树 preOrder(${node.right ?? 'NULL'})`, data: { tree: treeData, traversal: `前序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      preorder(node.right);
    }

    steps.push({ line: 2, phase: '开始', description: '开始前序遍历：根→左→右', data: { tree: treeData, traversal: '前序: ' }, highlights: {} });
    preorder(1);
    steps.push({ line: 7, phase: '完成', description: `前序遍历结果：${result.join(' → ')}`, data: { tree: treeData, traversal: `前序: ${result.join(' → ')}` }, highlights: { sorted: visited } });
    return steps;
  }
};

registry.register(entry);
export default entry;
