import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch1-linked-list-ops',
  name: '链表操作',
  nameEn: 'Linked List Ops',
  chapter: 'ch1-linear-list',
  chapterName: '线性表',
  description: '单链表通过指针将各个结点串联。插入操作的关键是"先连后继，再连前驱"（即先让新结点指向后继，再让前驱指向新结点），顺序不能反！删除操作是让前驱的next跳过被删结点指向后继，然后释放被删结点。考研必考：头插法建表(逆序)、尾插法建表(正序)、带头结点vs不带头结点的区别。',
  complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['考研必考：头插法、尾插法建表', '插入删除需要修改指针，顺序不能错', '带头结点和不带头结点的区别', '注意断链问题'],
  rendererType: 'linked-list',
  defaultData: [10, 20, 30, 40, 50],
  sourceCode: `// 单链表结点定义
typedef struct LNode {
    ElemType data;      // 数据域
    struct LNode *next; // 指针域
} LNode, *LinkList;

// 在第 pos 个位置插入元素 e（头结点法）
bool ListInsert(LinkList &L, int pos, ElemType e) {
    LNode *p = L;           // p 指向头结点
    int j = 0;              // j 为计数器
    while (p && j < pos - 1) { // 找到第 pos-1 个结点
        p = p->next;
        j++;
    }
    if (!p || j > pos - 1)  // 位置不合法
        return false;
    LNode *s = new LNode;   // 创建新结点
    s->data = e;            // 填入数据
    s->next = p->next;      // ①新结点指向后继（先）
    p->next = s;            // ②前驱指向新结点（后）
    return true;
}

// 删除第 pos 个位置的元素
bool ListDelete(LinkList &L, int pos, ElemType &e) {
    LNode *p = L;
    int j = 0;
    while (p->next && j < pos - 1) { // 找到第 pos-1 个
        p = p->next;
        j++;
    }
    if (!(p->next) || j > pos - 1)
        return false;
    LNode *q = p->next;     // q 指向待删结点
    e = q->data;            // 取出被删元素
    p->next = q->next;      // 前驱跳过被删结点
    delete q;               // 释放空间
    return true;
}`,
  generateSteps(arr) {
    const nodes = arr.map((v, i) => ({ id: i, value: v, next: i + 1 < arr.length ? i + 1 : null }));
    const steps = [];
    const insertPos = 2, insertVal = 15;

    // --- Insert demo ---
    steps.push({ line: 9, phase: '插入', description: `链表: ${arr.join(' → ')}，在第 ${insertPos} 个位置插入 ${insertVal}`, data: { nodes: [...nodes] }, highlights: {}, pointers: { head: { position: 0, label: '头' } } });
    let p = 0;
    steps.push({ line: 11, phase: '初始化', description: 'p 指向头结点，j=0', data: { nodes: [...nodes] }, highlights: { active: [p] }, pointers: { p: { position: p, label: 'p' } } });
    for (let j = 0; j < insertPos - 1; j++) {
      steps.push({ line: 13, phase: '遍历', description: `j=${j} < ${insertPos - 1}，p = p->next`, data: { nodes: [...nodes] }, highlights: { active: [p] }, pointers: { p: { position: p, label: 'p' } } });
      p = nodes[p].next;
    }
    const newNode = { id: nodes.length, value: insertVal, next: nodes[p].next };
    nodes.push(newNode);
    nodes[p].next = newNode.id;
    steps.push({ line: 19, phase: '插入完成', description: `s->next = p->next（①先连后继），p->next = s（②再连前驱）`, data: { nodes: [...nodes] }, highlights: { found: [newNode.id], active: [p] }, pointers: { p: { position: p, label: 'p' }, s: { position: newNode.id, label: 's(新)' } } });

    // --- Delete demo ---
    const delPos = 4;
    let pDel = 0;
    for (let j = 0; j < delPos - 1; j++) { pDel = nodes[pDel].next; }
    const qNode = nodes[nodes[pDel].next];
    steps.push({ line: 24, phase: '删除', description: `删除第 ${delPos} 个结点(值${qNode.value})：p->next = q->next，delete q`, data: { nodes: [...nodes] }, highlights: { swapping: [qNode.id], active: [pDel] }, pointers: { p: { position: pDel, label: 'p' }, q: { position: qNode.id, label: 'q(删)' } } });
    nodes[pDel].next = qNode.next;
    steps.push({ line: 30, phase: '完成', description: `删除完成`, data: { nodes: [...nodes] }, highlights: { sorted: nodes.filter(n => n.next !== null || n.id === 0).map(n => n.id) }, pointers: {} });

    return steps;
  }
};

registry.register(entry);
export default entry;
