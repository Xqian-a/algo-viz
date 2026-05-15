import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-merge-sort',
  name: '归并排序',
  nameEn: 'Merge Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '归并排序采用分治策略：将数组不断二分直到每个子数组只有一个元素，然后两两合并为有序数组。合并时比较两个子数组的元素，按序放入结果数组。时间复杂度始终为O(nlogn)，与初始状态无关。需要O(n)额外空间。是稳定排序。考研重点：手算归并过程，理解递归树和时间复杂度分析。',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)', stable: '是' },
  keyPoints: ['分治思想的典型应用', '时间复杂度始终为O(n log n)', '需要O(n)额外空间', '是稳定排序', '考研必考：理解递归过程和合并操作'],
  rendererType: 'array',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `// 合并两个有序子数组 arr[l..m] 和 arr[m+1..r]
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];                          // 创建临时数组
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {                 // 归并：取较小值
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];          // 复制左数组剩余
    while (j < n2) arr[k++] = R[j++];          // 复制右数组剩余
}

// 归并排序：分治法
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;               // 取中点
        mergeSort(arr, l, m);                   // 递归排左半
        mergeSort(arr, m + 1, r);               // 递归排右半
        merge(arr, l, m, r);                    // 合并两个有序部分
    }
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = [];
    steps.push({ line: 15, phase: '初始化', description: `开始归并排序`, data: { array: [...a] }, highlights: {}, pointers: {} });

    function mergeSortHelper(l, r) {
      if (l >= r) return;
      const m = Math.floor(l + (r - l) / 2);
      steps.push({ line: 17, phase: '分解', description: `将 [${l}..${r}] 分解为 [${l}..${m}] 和 [${m + 1}..${r}]`, data: { array: [...a] }, highlights: { active: Array.from({ length: r - l + 1 }, (_, i) => l + i) }, pointers: {} });

      mergeSortHelper(l, m);
      mergeSortHelper(m + 1, r);

      // Merge
      const L = a.slice(l, m + 1);
      const R = a.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      while (i < L.length && j < R.length) {
        steps.push({ line: 7, phase: '比较合并', description: `比较 L[${i}]=${L[i]} 和 R[${j}]=${R[j]}`, data: { array: [...a] }, highlights: { comparing: [l + i, m + 1 + j] }, pointers: {} });
        if (L[i] <= R[j]) {
          a[k] = L[i]; i++;
        } else {
          a[k] = R[j]; j++;
        }
        steps.push({ line: 8, phase: '放置', description: `将 ${a[k]} 放入位置 ${k}`, data: { array: [...a] }, highlights: { found: [k] }, pointers: {} });
        k++;
      }
      while (i < L.length) { a[k++] = L[i++]; }
      while (j < R.length) { a[k++] = R[j++]; }

      steps.push({ line: 21, phase: '合并完成', description: `区间 [${l}..${r}] 合并完成`, data: { array: [...a] }, highlights: { sorted: Array.from({ length: r - l + 1 }, (_, i) => l + i) }, pointers: {} });
    }

    mergeSortHelper(0, n - 1);
    steps.push({ line: 21, phase: '完成', description: '归并排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
