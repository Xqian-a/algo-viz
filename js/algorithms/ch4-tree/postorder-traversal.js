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
  id: 'ch4-postorder',
  name: '后序遍历',
  nameEn: 'Postorder Traversal',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: '后序遍历(Postorder)的访问顺序是"左→右→根"：先递归遍历左子树，再递归遍历右子树，最后访问根结点。应用场景：计算目录大小、释放二叉树内存、获得后缀表达式。考研重点：由后序+中序可唯一确定二叉树。后序遍历的非递归实现比前序和中序更复杂，需要记录上次访问的结点。',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)', stable: '—' },
  keyPoints: ['访问顺序：左→右→根', '可用于计算目录大小、释放内存', '考研常考：由后序+中序构造二叉树', '非递归实现比前序和中序更复杂'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `// 后序遍历：左 → 右 → 根
void postOrder(BiTree T) {
    if (T != NULL) {            // 递归终止条件
        postOrder(T->lchild);   // ① 先递归遍历左子树
        postOrder(T->rchild);   // ② 再递归遍历右子树
        visit(T);               // ③ 最后访问根结点
    }
}`,
  generateSteps() {
    const treeData = JSON.parse(JSON.stringify(TREE));
    const steps = [];
    const visited = [];
    const result = [];

    function postorder(id) {
      if (!id) return;
      const node = treeData.nodes.find(n => n.id === id);
      if (!node) return;
      steps.push({ line: 4, phase: '递归左', description: `递归进入左子树 postOrder(${node.left ?? 'NULL'})`, data: { tree: treeData, traversal: `后序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      postorder(node.left);
      steps.push({ line: 5, phase: '递归右', description: `递归进入右子树 postOrder(${node.right ?? 'NULL'})`, data: { tree: treeData, traversal: `后序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      postorder(node.right);
      result.push(node.value);
      steps.push({ line: 6, phase: '访问', description: `visit(${node.value})：最后访问根结点，序列 [${result.join(',')}]`, data: { tree: treeData, traversal: `后序: ${result.join(' → ')}` }, highlights: { current: id, visited: [...visited] } });
      visited.push(id);
    }

    steps.push({ line: 2, phase: '开始', description: '开始后序遍历：左→右→根', data: { tree: treeData, traversal: '后序: ' }, highlights: {} });
    postorder(1);
    steps.push({ line: 7, phase: '完成', description: `后序遍历结果：${result.join(' → ')}`, data: { tree: treeData, traversal: `后序: ${result.join(' → ')}` }, highlights: { sorted: visited } });
    return steps;
  }
};

registry.register(entry);
export default entry;
