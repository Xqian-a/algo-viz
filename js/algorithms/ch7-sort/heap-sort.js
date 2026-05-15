import { registry } from '../../core/registry.js';

// Build a binary tree from array — ALWAYS show all n nodes
// heapSize determines which nodes are "active" (in the heap)
// Nodes beyond heapSize are shown as "sorted" (grayed/green)
function arrayToHeapTree(arr, n, heapSize, sortedIndices) {
  const nodes = [];
  for (let i = 0; i < n; i++) {
    const left = (2 * i + 1 < n) ? 2 * i + 1 + 1000 : null;
    const right = (2 * i + 2 < n) ? 2 * i + 2 + 1000 : null;
    nodes.push({ id: i + 1000, value: arr[i], left, right });
  }
  return { root: 1000, nodes };
}

const entry = {
  id: 'ch7-heap-sort',
  name: '堆排序',
  nameEn: 'Heap Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '堆排序利用完全二叉树(堆)进行排序。第一步建大顶堆(从最后一个非叶子结点开始自底向上调整)；第二步反复将堆顶(最大值)与末尾交换，缩小堆范围，重新调整堆。时间复杂度始终O(nlogn)。是不稳定排序。考研重点：手算建堆和调整堆的过程，理解heapify的下沉操作。',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)', stable: '否' },
  keyPoints: ['建堆过程时间复杂度为O(n)', '调整堆的过程为O(log n)', '不稳定排序', '考研重点：手动建堆和调整堆的过程'],
  rendererType: 'tree',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `// 堆调整：将以 i 为根的子树调整为大顶堆
void heapify(int arr[], int n, int i) {
    int largest = i;            // 假设根最大
    int left = 2 * i + 1;      // 左孩子下标
    int right = 2 * i + 2;     // 右孩子下标
    // 与左孩子比较
    if (left < n && arr[left] > arr[largest])
        largest = left;
    // 与右孩子比较
    if (right < n && arr[right] > arr[largest])
        largest = right;
    // 如果最大值不是根，需要交换并继续调整
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest); // 递归调整
    }
}

// 堆排序
void heapSort(int arr[], int n) {
    // 第一步：建大顶堆（从最后一个非叶子结点开始）
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    // 第二步：依次取出堆顶放到末尾
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);    // 堆顶(最大)换到末尾
        heapify(arr, i, 0);      // 对剩余元素重新建堆
    }
}`,
  generateSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const steps = [];
    const sortedIndices = new Set();

    function makeStep(heapSize, highlights, extra = {}) {
      const tree = arrayToHeapTree(a, n, heapSize, sortedIndices);
      const hl = { ...highlights };
      // Map highlight indices to node IDs (index + 1000)
      if (hl.comparing) hl.comparing = hl.comparing.map(i => i + 1000);
      if (hl.swapping) hl.swapping = hl.swapping.map(i => i + 1000);
      if (hl.active) hl.active = hl.active.map(i => i + 1000);
      if (hl.found) hl.found = hl.found.map(i => i + 1000);
      if (hl.current !== undefined) hl.current = hl.current + 1000;
      // Sorted indices always shown in green
      hl.sorted = [...sortedIndices].map(i => i + 1000);
      return { data: { tree }, highlights: hl, ...extra };
    }

    steps.push({ line: 44, phase: '初始化', description: `开始堆排序，先建立大顶堆`, ...makeStep(n, {}) });

    function heapify(size, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < size) {
        steps.push({ line: 7, phase: '比较', description: `比较 arr[${i}]=${a[i]} 和左孩子 arr[${left}]=${a[left]}`, ...makeStep(size, { comparing: [i, left] }) });
        if (a[left] > a[largest]) largest = left;
      }
      if (right < size) {
        steps.push({ line: 10, phase: '比较', description: `比较 arr[${largest}]=${a[largest]} 和右孩子 arr[${right}]=${a[right]}`, ...makeStep(size, { comparing: [largest, right] }) });
        if (a[right] > a[largest]) largest = right;
      }
      if (largest !== i) {
        steps.push({ line: 13, phase: '交换', description: `交换 arr[${i}]=${a[i]} ↔ arr[${largest}]=${a[largest]}`, ...makeStep(size, { swapping: [i, largest] }) });
        [a[i], a[largest]] = [a[largest], a[i]];
        heapify(size, largest);
      }
    }

    // Build heap phase
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({ line: 46, phase: '建堆', description: `调整以结点 ${i}(值${a[i]}) 为根的子树`, ...makeStep(n, { active: [i] }) });
      heapify(n, i);
    }
    steps.push({ line: 47, phase: '建堆完成', description: `大顶堆建立完成，堆顶 ${a[0]} 为最大值`, ...makeStep(n, { active: [0] }) });

    // Extract elements phase
    for (let i = n - 1; i > 0; i--) {
      steps.push({ line: 50, phase: '交换堆顶', description: `堆顶 ${a[0]} 与 arr[${i}]=${a[i]} 交换，${a[0]} 已排好`, ...makeStep(i + 1, { swapping: [0, i] }) });
      [a[0], a[i]] = [a[i], a[0]];
      sortedIndices.add(i);
      heapify(i, 0);
      steps.push({ line: 51, phase: '调整堆', description: `缩小堆范围到 [0..${i - 1}]，重新调整`, ...makeStep(i, {}) });
    }

    sortedIndices.add(0);
    steps.push({ line: 52, phase: '完成', description: '堆排序完成！', ...makeStep(0, {}) });
    return steps;
  }
};

registry.register(entry);
export default entry;
