import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch4-avl-tree',
  name: 'AVL树',
  nameEn: 'AVL Tree',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: 'AVL树是自平衡的二叉排序树，任意结点的平衡因子(左子树高-右子树高)只能是-1、0或1。当插入导致失衡时，需要通过旋转恢复平衡：LL型→右旋、RR型→左旋、LR型→先左旋再右旋、RL型→先右旋再左旋。插入最多只需一次旋转，删除可能需要多次旋转。考研重点：判断失衡类型和执行旋转操作。',
  complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['平衡因子 = 左子树高度 - 右子树高度', '四种旋转：LL, RR, LR, RL', '考研重点：判断需要哪种旋转', '插入后只需一次旋转即可平衡'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `// LL旋转 (右旋)：在左子树的左子树插入导致失衡
AVLNode* LL_Rotate(AVLNode *k2) {
    AVLNode *k1 = k2->lchild;          // k1是k2的左孩子
    k2->lchild = k1->rchild;           // k1的右子树给k2做左子树
    k1->rchild = k2;                   // k2成为k1的右孩子
    k2->height = max(H(k2->lchild), H(k2->rchild)) + 1; // 更新高度
    k1->height = max(H(k1->lchild), k2->height) + 1;
    return k1;                         // k1成为新根
}

// RR旋转 (左旋)：在右子树的右子树插入导致失衡
AVLNode* RR_Rotate(AVLNode *k1) {
    AVLNode *k2 = k1->rchild;          // k2是k1的右孩子
    k1->rchild = k2->lchild;           // k2的左子树给k1做右子树
    k2->lchild = k1;                   // k1成为k2的左孩子
    k1->height = max(H(k1->lchild), H(k1->rchild)) + 1; // 更新高度
    k2->height = max(k1->height, H(k2->rchild)) + 1;
    return k2;                         // k2成为新根
}`,
  generateSteps() {
    // LL rotation example: insert 3, 2, 1
    const treeData = {
      root: 2,
      nodes: [
        { id: 2, value: 2, left: 1, right: 3, bf: 0 },
        { id: 1, value: 1, left: null, right: null, bf: 0 },
        { id: 3, value: 3, left: null, right: null, bf: 0 },
      ]
    };
    const steps = [];
    steps.push({ line: 1, phase: '初始', description: 'AVL树已平衡：[1, 2, 3]', data: { tree: treeData }, highlights: {} });

    const treeData2 = {
      root: 3,
      nodes: [
        { id: 3, value: 3, left: 2, right: 4, bf: 1 },
        { id: 2, value: 2, left: 1, right: null, bf: 1 },
        { id: 4, value: 4, left: null, right: null, bf: 0 },
        { id: 1, value: 1, left: null, right: null, bf: 0 },
      ]
    };
    steps.push({ line: 1, phase: '插入', description: '插入结点 1，结点 3 的平衡因子变为 2（失衡）', data: { tree: treeData2 }, highlights: { active: [3] } });

    steps.push({ line: 2, phase: 'LL型', description: '失衡类型：LL型（在左子树的左子树插入），需要右旋', data: { tree: treeData2 }, highlights: { active: [3, 2] } });

    const treeData3 = {
      root: 2,
      nodes: [
        { id: 2, value: 2, left: 1, right: 3, bf: 0 },
        { id: 1, value: 1, left: null, right: null, bf: 0 },
        { id: 3, value: 3, left: null, right: 4, bf: -1 },
        { id: 4, value: 4, left: null, right: null, bf: 0 },
      ]
    };
    steps.push({ line: 3, phase: '右旋', description: '右旋完成：k1(2) 成为新根，k2(3) 成为 k1 的右孩子', data: { tree: treeData3 }, highlights: { found: [2] } });
    steps.push({ line: 8, phase: '完成', description: 'AVL树重新平衡，所有结点的平衡因子 ∈ {-1, 0, 1}', data: { tree: treeData3 }, highlights: { sorted: [1, 2, 3, 4] } });
    return steps;
  }
};

registry.register(entry);
export default entry;
