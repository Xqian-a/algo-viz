import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch4-bst-ops',
  name: '建立二叉排序树',
  nameEn: 'Build BST',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: '二叉排序树(BST)的建立过程：依次将元素插入空树。每个元素从根开始比较，小则走左，大则走右，直到找到空位插入。插入顺序不同，得到的BST形态不同！中序遍历BST一定得到递增序列。考研重点：根据给定序列画出BST。',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['插入顺序决定BST形态', '中序遍历一定递增有序', '最好O(nlogn)，最坏O(n²)退化为链表', '考研重点：根据序列手画BST'],
  rendererType: 'tree',
  defaultData: [50, 30, 70, 20, 40, 60, 80],
  sourceCode: `// BST插入：找到空位插入新结点
bool BST_Insert(BSTree &T, KeyType key) {
    if (T == NULL) {                        // 找到空位
        T = new BSTNode;                    // 创建新结点
        T->key = key;
        T->lchild = T->rchild = NULL;
        return true;
    }
    if (key == T->key) return false;        // 关键字已存在
    if (key < T->key)                       // 小于则插入左子树
        return BST_Insert(T->lchild, key);
    else                                    // 大于则插入右子树
        return BST_Insert(T->rchild, key);
}

// 建立BST：依次插入每个元素
void CreateBST(BSTree &T, int keys[], int n) {
    T = NULL;                               // 初始化空树
    for (int i = 0; i < n; i++)             // 依次插入
        BST_Insert(T, keys[i]);
}`,
  generateSteps(arr) {
    const values = arr || [50, 30, 70, 20, 40, 60, 80];
    const nodes = [];
    let nextId = 1;
    const steps = [];

    function makeTreeData() {
      return { root: nodes.length > 0 ? nodes[0].id : null, nodes: nodes.map(n => ({ ...n })) };
    }

    function insert(key) {
      if (nodes.length === 0) {
        const node = { id: nextId++, value: key, left: null, right: null };
        nodes.push(node);
        steps.push({ line: 4, phase: '创建根结点', description: `树为空，创建根结点 ${key}`, data: { tree: makeTreeData() }, highlights: { found: [node.id] } });
        return;
      }

      let currentId = nodes[0].id;
      const path = [currentId];

      while (true) {
        const current = nodes.find(n => n.id === currentId);
        if (key === current.value) {
          steps.push({ line: 10, phase: '重复', description: `${key} == ${current.value}，关键字已存在，跳过`, data: { tree: makeTreeData() }, highlights: { current: currentId, visited: path } });
          return;
        }
        if (key < current.value) {
          steps.push({ line: 11, phase: '比较', description: `${key} < ${current.value}，走左子树`, data: { tree: makeTreeData() }, highlights: { comparing: [currentId], visited: path.slice(0, -1) } });
          if (current.left === null) {
            const node = { id: nextId++, value: key, left: null, right: null };
            nodes.push(node);
            current.left = node.id;
            steps.push({ line: 4, phase: '插入左孩子', description: `${key} 插入为 ${current.value} 的左孩子`, data: { tree: makeTreeData() }, highlights: { found: [node.id], active: [currentId] } });
            return;
          }
          currentId = current.left;
        } else {
          steps.push({ line: 13, phase: '比较', description: `${key} > ${current.value}，走右子树`, data: { tree: makeTreeData() }, highlights: { comparing: [currentId], visited: path.slice(0, -1) } });
          if (current.right === null) {
            const node = { id: nextId++, value: key, left: null, right: null };
            nodes.push(node);
            current.right = node.id;
            steps.push({ line: 4, phase: '插入右孩子', description: `${key} 插入为 ${current.value} 的右孩子`, data: { tree: makeTreeData() }, highlights: { found: [node.id], active: [currentId] } });
            return;
          }
          currentId = current.right;
        }
        path.push(currentId);
      }
    }

    steps.push({ line: 20, phase: '初始化', description: `开始建立BST，依次插入: [${values.join(', ')}]`, data: { tree: { root: null, nodes: [] } }, highlights: {} });

    for (const v of values) {
      steps.push({ line: 21, phase: '插入', description: `插入元素 ${v}`, data: { tree: makeTreeData() }, highlights: {} });
      insert(v);
    }

    steps.push({ line: 22, phase: '完成', description: `BST建立完成！中序遍历：${[...values].sort((a, b) => a - b).join(' → ')}`, data: { tree: makeTreeData() }, highlights: { sorted: nodes.map(n => n.id) } });
    return steps;
  }
};

registry.register(entry);
export default entry;
