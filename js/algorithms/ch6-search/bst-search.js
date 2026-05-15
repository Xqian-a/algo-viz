import { registry } from '../../core/registry.js';

const TREE = {
  root: 50,
  nodes: [
    { id: 50, value: 50, left: 30, right: 70 },
    { id: 30, value: 30, left: 20, right: 40 },
    { id: 70, value: 70, left: 60, right: 80 },
    { id: 20, value: 20, left: null, right: null },
    { id: 40, value: 40, left: null, right: null },
    { id: 60, value: 60, left: null, right: null },
    { id: 80, value: 80, left: null, right: null },
  ]
};

const entry = {
  id: 'ch6-bst-search',
  name: '二叉排序树查找',
  nameEn: 'BST Search',
  chapter: 'ch6-search',
  chapterName: '查找',
  description: '在二叉排序树(BST)中查找：从根结点开始，若key等于当前结点则查找成功；若key小于当前结点则进入左子树；若大于则进入右子树。平均时间复杂度O(logn)，最坏O(n)(退化为单链表)。修改数据时最后一位为查找目标。',
  complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['查找效率与树的形态有关', '最好情况为完全二叉树', '最坏情况退化为单链表', '修改数据时最后一位为查找目标'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `BSTNode* BST_Search(BSTree T, KeyType key) {
    while (T != NULL && key != T->key) {
        if (key < T->key)       // 小于则走左子树
            T = T->lchild;
        else                    // 大于则走右子树
            T = T->rchild;
    }
    return T;                   // 返回查找结果
}`,
  generateSteps(arr, searchKey) {
    const treeData = JSON.parse(JSON.stringify(TREE));
    const key = (searchKey !== undefined && searchKey !== null) ? searchKey : 60;
    const steps = [];

    steps.push({ line: 1, phase: '开始', description: `在BST中查找 key=${key}，从根结点开始`, data: { tree: treeData }, highlights: {} });

    const nodeMap = {};
    for (const n of treeData.nodes) nodeMap[n.id] = n;

    let currentId = treeData.root;
    const path = [];

    while (currentId !== null) {
      const current = nodeMap[currentId];
      path.push(currentId);

      if (key === current.value) {
        steps.push({ line: 2, phase: '找到', description: `当前结点 ${current.value}，${key} == ${current.value}，查找成功！`, data: { tree: treeData }, highlights: { found: [currentId], visited: path.slice(0, -1) } });
        steps.push({ line: 8, phase: '完成', description: `查找路径：${path.join(' → ')}，比较次数：${path.length}`, data: { tree: treeData }, highlights: { found: [currentId], visited: path.slice(0, -1) } });
        return steps;
      }

      if (key < current.value) {
        steps.push({ line: 3, phase: '比较', description: `${key} < ${current.value}，走左子树`, data: { tree: treeData }, highlights: { current: currentId, visited: path.slice(0, -1) } });
        currentId = current.left;
      } else {
        steps.push({ line: 5, phase: '比较', description: `${key} > ${current.value}，走右子树`, data: { tree: treeData }, highlights: { current: currentId, visited: path.slice(0, -1) } });
        currentId = current.right;
      }
    }

    steps.push({ line: 8, phase: '失败', description: `查找路径：${path.join(' → ')}，${key} 不在BST中，查找失败！`, data: { tree: treeData }, highlights: { visited: path } });
    return steps;
  }
};

registry.register(entry);
export default entry;
