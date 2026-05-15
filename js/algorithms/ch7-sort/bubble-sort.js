import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-bubble-sort',
  name: '冒泡排序',
  nameEn: 'Bubble Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '冒泡排序是最简单的交换排序。每轮从前往后依次比较相邻元素，若逆序则交换，将最大值"冒泡"到末尾。n个元素需要n-1轮。最好情况(已有序)只需一轮比较O(n)；最坏情况(逆序)需要n(n-1)/2次比较O(n²)。是稳定排序，是原地排序。考研重点：理解"冒泡"的含义，判断是否稳定。',
  complexity: { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: '是' },
  keyPoints: ['每轮将最大元素交换到末尾', '最好情况下(已有序)时间复杂度为O(n)', '是稳定排序', '考研重点：理解内外层循环的作用'],
  rendererType: 'array',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {        // 外层循环：控制轮数
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) { // 内层循环：相邻比较
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];             // 交换相邻元素
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;                   // 本轮无交换，已有序
    }
}`,
  generateSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const steps = [];
    const sorted = [];

    steps.push({ line: 1, phase: '初始化', description: `开始冒泡排序，数组长度 n=${n}`, data: { array: [...a] }, highlights: {}, pointers: {} });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      steps.push({ line: 2, phase: '外层循环', description: `第 ${i + 1} 轮冒泡，i=${i}`, data: { array: [...a] }, highlights: { sorted: [...sorted] }, pointers: { i: { position: i, label: `i=${i}` } } });

      for (let j = 0; j < n - 1 - i; j++) {
        steps.push({ line: 5, phase: '比较', description: `比较 arr[${j}]=${a[j]} 和 arr[${j + 1}]=${a[j + 1]}`, data: { array: [...a] }, highlights: { comparing: [j, j + 1], sorted: [...sorted] }, pointers: { i: { position: i, label: `i=${i}` }, j: { position: j, label: `j=${j}` } } });

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
          steps.push({ line: 6, phase: '交换', description: `交换 arr[${j}] 和 arr[${j + 1}]`, data: { array: [...a] }, highlights: { swapping: [j, j + 1], sorted: [...sorted] }, pointers: { i: { position: i, label: `i=${i}` }, j: { position: j, label: `j=${j}` } }, animation: { type: 'swap' } });
        }
      }

      sorted.unshift(n - 1 - i);
      steps.push({ line: 11, phase: '完成一轮', description: `第 ${i + 1} 轮完成，arr[${n - 1 - i}]=${a[n - 1 - i]} 已就位`, data: { array: [...a] }, highlights: { sorted: [...sorted] }, pointers: {} });

      if (!swapped) {
        for (let k = 0; k < n; k++) { if (!sorted.includes(k)) sorted.push(k); }
        steps.push({ line: 12, phase: '提前结束', description: '本轮未发生交换，数组已有序，提前结束', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
        break;
      }
    }

    if (steps[steps.length - 1].phase !== '提前结束') {
      steps.push({ line: 13, phase: '完成', description: '冒泡排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    }
    return steps;
  }
};

registry.register(entry);
export default entry;
