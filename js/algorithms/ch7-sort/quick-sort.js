import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-quick-sort',
  name: '快速排序',
  nameEn: 'Quick Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '快速排序是考研最重要的排序算法。选一个基准(pivot)，将数组分为小于基准和大于基准的两部分(一趟划分)，递归排序两部分。平均时间复杂度O(nlogn)，最坏O(n²)(已有序时退化)。空间复杂度O(logn)(递归栈)。是不稳定排序。考研必考：手算一趟划分过程，理解基准选择的影响。',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)', stable: '否' },
  keyPoints: ['考研排序中最重要的算法', '最坏情况发生在已有序数组', '平均性能最好的内部排序', '不稳定排序', '基准元素的选择很关键'],
  rendererType: 'array',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `int partition(int arr[], int low, int high) {
    int pivot = arr[low];                        // 选取基准元素
    while (low < high) {
        while (low < high && arr[high] >= pivot) // 从右往左找小于基准的
            high--;
        arr[low] = arr[high];
        while (low < high && arr[low] <= pivot)  // 从左往右找大于基准的
            low++;
        arr[high] = arr[low];
    }
    arr[low] = pivot;                            // 基准归位
    return low;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pos = partition(arr, low, high);     // 一趟划分
        quickSort(arr, low, pos - 1);            // 递归排左半部分
        quickSort(arr, pos + 1, high);           // 递归排右半部分
    }
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = [];
    const sorted = [];
    steps.push({ line: 13, phase: '初始化', description: '开始快速排序', data: { array: [...a] }, highlights: {}, pointers: {} });

    function qs(low, high) {
      if (low >= high) {
        if (low === high) sorted.push(low);
        return;
      }
      const pivot = a[low];
      steps.push({ line: 2, phase: '选基准', description: `选择基准 pivot=arr[${low}]=${pivot}，区间 [${low}..${high}]`, data: { array: [...a] }, highlights: { active: [low], sorted: [...sorted] }, pointers: { low: { position: low, label: `low=${low}` }, high: { position: high, label: `high=${high}` } } });

      let l = low, h = high;
      while (l < h) {
        while (l < h && a[h] >= pivot) {
          steps.push({ line: 4, phase: '右指针左移', description: `arr[${h}]=${a[h]} >= ${pivot}，high--`, data: { array: [...a] }, highlights: { comparing: [h], active: [low], sorted: [...sorted] }, pointers: { low: { position: l, label: `low=${l}` }, high: { position: h, label: `high=${h}` } } });
          h--;
        }
        if (l < h) {
          a[l] = a[h];
          steps.push({ line: 5, phase: '赋值', description: `arr[${l}] = arr[${h}] = ${a[h]}`, data: { array: [...a] }, highlights: { swapping: [l, h], sorted: [...sorted] }, pointers: { low: { position: l, label: `low=${l}` }, high: { position: h, label: `high=${h}` } } });
        }
        while (l < h && a[l] <= pivot) {
          steps.push({ line: 6, phase: '左指针右移', description: `arr[${l}]=${a[l]} <= ${pivot}，low++`, data: { array: [...a] }, highlights: { comparing: [l], active: [low], sorted: [...sorted] }, pointers: { low: { position: l, label: `low=${l}` }, high: { position: h, label: `high=${h}` } } });
          l++;
        }
        if (l < h) {
          a[h] = a[l];
          steps.push({ line: 7, phase: '赋值', description: `arr[${h}] = arr[${l}] = ${a[l]}`, data: { array: [...a] }, highlights: { swapping: [l, h], sorted: [...sorted] }, pointers: {} });
        }
      }
      a[l] = pivot;
      sorted.push(l);
      steps.push({ line: 9, phase: '基准归位', description: `基准 ${pivot} 放回位置 ${l}，左侧都小于它，右侧都大于它`, data: { array: [...a] }, highlights: { found: [l], sorted: [...sorted] }, pointers: {} });

      qs(low, l - 1);
      qs(l + 1, high);
    }

    qs(0, n - 1);
    steps.push({ line: 18, phase: '完成', description: '快速排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
