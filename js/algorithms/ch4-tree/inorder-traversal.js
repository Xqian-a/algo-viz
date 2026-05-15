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
  id: 'ch4-inorder',
  name: '中序遍历',
  nameEn: 'Inorder Traversal',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: '中序遍历(Inorder)的访问顺序是"左→根→右"：先递归遍历左子树，再访问根结点，最后递归遍历右子树。对二叉排序树(BST)进行中序遍历可以得到一个递增有序序列。考研重点：由中序+后序序列也可以唯一确定一棵二叉树（后序的最后一个是根）。非递归实现需要借助栈。',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)', stable: '—' },
  keyPoints: ['访问顺序：左→根→右', 'BST的中序遍历是递增有序序列', '考研常考：由前序+中序构造二叉树', '非递归实现需要借助栈'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `// 中序遍历：左 → 根 → 右
void inOrder(BiTree T) {
    if (T != NULL) {          // 递归终止条件
        inOrder(T->lchild);   // ① 先递归遍历左子树
        visit(T);             // ② 再访问根结点
        inOrder(T->rchild);   // ③ 最后递归遍历右子树
    }
}`,
  generateSteps() {
    const treeData = JSON.parse(JSON.stringify(TREE));
    const steps = [];
    const visited = [];
    const result = [];

    function inorder(id) {
      if (!id) return;
      const node = treeData.nodes.find(n => n.id === id);
      if (!node) return;
      steps.push({ line: 4, phase: '递归左', description: `递归进入左子树 inOrder(${node.left ?? 'NULL'})`, data: { tree: treeData, traversal: `中序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      inorder(node.left);
      result.push(node.value);
      steps.push({ line: 5, phase: '访问', description: `visit(${node.value})：访问根结点，序列 [${result.join(',')}]`, data: { tree: treeData, traversal: `中序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      visited.push(id);
      steps.push({ line: 6, phase: '递归右', description: `递归进入右子树 inOrder(${node.right ?? 'NULL'})`, data: { tree: treeData, traversal: `中序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      inorder(node.right);
    }

    steps.push({ line: 2, phase: '开始', description: '开始中序遍历：左→根→右', data: { tree: treeData, traversal: '中序: ' }, highlights: {} });
    inorder(1);
    steps.push({ line: 7, phase: '完成', description: `中序遍历结果：${result.join(' → ')}`, data: { tree: treeData, traversal: `中序: ${result.join(' → ')}` }, highlights: { sorted: visited } });
    return steps;
  }
};

registry.register(entry);
export default entry;
