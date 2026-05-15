import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-selection-sort',
  name: '选择排序',
  nameEn: 'Selection Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '选择排序每轮从未排序部分选出最小元素，与未排序部分的第一个元素交换。n个元素需要n-1轮选择。比较次数固定为n(n-1)/2，与初始状态无关。移动次数最好0次(已有序)，最坏3(n-1)次。是不稳定排序（交换可能改变相等元素的相对顺序）。考研重点：理解为什么不稳定，举例说明。',
  complexity: { time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: '否' },
  keyPoints: ['每轮选择最小元素放到前面', '不稳定排序（交换可能改变相对顺序）', '比较次数固定为n(n-1)/2', '移动次数最少为0'],
  rendererType: 'array',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {     // 外层循环
        int minIdx = i;                     // 记录最小值下标
        for (int j = i + 1; j < n; j++) {  // 找最小值
            if (arr[j] < arr[minIdx]) {
                minIdx = j;                 // 更新最小值下标
            }
        }
        if (minIdx != i) {                  // 交换到正确位置
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = []; const sorted = [];
    steps.push({ line: 1, phase: '初始化', description: `开始选择排序，数组长度 n=${n}`, data: { array: [...a] }, highlights: {}, pointers: {} });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({ line: 2, phase: '外层循环', description: `第 ${i + 1} 轮，从位置 ${i} 开始寻找最小值`, data: { array: [...a] }, highlights: { sorted: [...sorted], active: [i] }, pointers: { i: { position: i, label: `i=${i}` } } });

      for (let j = i + 1; j < n; j++) {
        steps.push({ line: 5, phase: '比较', description: `比较 arr[${j}]=${a[j]} 和当前最小值 arr[${minIdx}]=${a[minIdx]}`, data: { array: [...a] }, highlights: { comparing: [j, minIdx], sorted: [...sorted], active: [i] }, pointers: { i: { position: i, label: `i=${i}` }, j: { position: j, label: `j=${j}` }, min: { position: minIdx, label: `min=${minIdx}` } } });
        if (a[j] < a[minIdx]) { minIdx = j; }
      }

      if (minIdx !== i) {
        steps.push({ line: 9, phase: '交换', description: `最小值在位置 ${minIdx}，值为 ${a[minIdx]}，与位置 ${i} 交换`, data: { array: [...a] }, highlights: { swapping: [i, minIdx], sorted: [...sorted] }, pointers: {} });
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
      }

      sorted.push(i);
      steps.push({ line: 13, phase: '完成一轮', description: `第 ${i + 1} 轮完成，arr[${i}]=${a[i]}`, data: { array: [...a] }, highlights: { sorted: [...sorted] }, pointers: {} });
    }

    sorted.push(n - 1);
    steps.push({ line: 14, phase: '完成', description: '选择排序完成！', data: { array: [...a] }, highlights: { sorted: [...sorted] }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
