import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch1-sequential-list',
  name: '顺序表操作',
  nameEn: 'Sequential List',
  chapter: 'ch1-linear-list',
  chapterName: '线性表',
  description: '顺序表是用连续的存储空间(数组)存储线性表元素。插入操作需要将插入位置后的所有元素从后往前逐个后移一位，时间复杂度O(n)；删除操作需要将删除位置后的所有元素从前往后逐个前移一位，时间复杂度O(n)；按位序查找O(1)，按值查找O(n)。考研重点：平均插入需要移动n/2个元素，平均删除需要移动(n-1)/2个元素。',
  complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['随机访问O(1)，插入删除O(n)', '考研重点：插入删除时元素移动方向', '注意边界条件：表满、位置合法性', '平均移动次数：插入n/2，删除(n-1)/2'],
  rendererType: 'array',
  defaultData: [10, 20, 30, 40, 50],
  sourceCode: `// 顺序表结构定义
#define MaxSize 50
typedef struct {
    ElemType data[MaxSize];  // 存储数据元素
    int length;              // 当前表长
} SqList;

// 在位置 pos 插入元素 e（考研重点）
bool ListInsert(SqList &L, int pos, ElemType e) {
    if (pos < 1 || pos > L.length + 1)  // 位置合法检查
        return false;
    if (L.length >= MaxSize)             // 表满检查
        return false;
    for (int i = L.length; i >= pos; i--)  // 从后往前移
        L.data[i] = L.data[i - 1];         // 元素后移
    L.data[pos - 1] = e;                   // 插入新元素
    L.length++;                            // 表长+1
    return true;
}

// 删除位置 pos 的元素，用 e 返回
bool ListDelete(SqList &L, int pos, ElemType &e) {
    if (pos < 1 || pos > L.length)  // 位置合法检查
        return false;
    e = L.data[pos - 1];            // 取出被删元素
    for (int i = pos; i < L.length; i++)  // 从前往后移
        L.data[i - 1] = L.data[i];       // 元素前移
    L.length--;                           // 表长-1
    return true;
}

// 按值查找，返回位序
int LocateElem(SqList L, ElemType e) {
    for (int i = 0; i < L.length; i++)
        if (L.data[i] == e)
            return i + 1;   // 返回位序（从1开始）
    return 0;               // 查找失败
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = [];
    const insertPos = 3, insertVal = 25;

    // --- Insert demo ---
    steps.push({ line: 11, phase: '插入操作', description: `顺序表: [${a.join(', ')}]，在位置 ${insertPos} 插入 ${insertVal}`, data: { array: [...a] }, highlights: {}, pointers: {} });
    steps.push({ line: 12, phase: '合法性检查', description: `pos=${insertPos}，1 ≤ ${insertPos} ≤ ${n + 1}，位置合法 ✓`, data: { array: [...a] }, highlights: { active: [insertPos - 1] }, pointers: {} });
    a.push(0); // expand
    for (let i = n - 1; i >= insertPos - 1; i--) {
      a[i + 1] = a[i];
      steps.push({ line: 16, phase: '后移', description: `data[${i + 1}] = data[${i}] = ${a[i]}（元素后移）`, data: { array: [...a] }, highlights: { comparing: [i, i + 1] }, pointers: {} });
    }
    a[insertPos - 1] = insertVal;
    steps.push({ line: 17, phase: '插入', description: `data[${insertPos - 1}] = ${insertVal}，插入完成`, data: { array: [...a] }, highlights: { found: [insertPos - 1] }, pointers: {} });

    // --- Delete demo ---
    const delPos = 2;
    const delVal = a[delPos - 1];
    steps.push({ line: 21, phase: '删除操作', description: `删除位置 ${delPos} 的元素 ${delVal}`, data: { array: [...a] }, highlights: { active: [delPos - 1] }, pointers: {} });
    for (let i = delPos; i < a.length; i++) {
      a[i - 1] = a[i];
      steps.push({ line: 25, phase: '前移', description: `data[${i - 1}] = data[${i}] = ${a[i]}（元素前移）`, data: { array: [...a] }, highlights: { comparing: [i - 1, i] }, pointers: {} });
    }
    a.pop();
    steps.push({ line: 26, phase: '完成', description: `删除完成，当前表: [${a.join(', ')}]`, data: { array: [...a] }, highlights: { sorted: Array.from({ length: a.length }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
