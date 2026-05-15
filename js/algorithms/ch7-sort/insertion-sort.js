import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-insertion-sort',
  name: '直接插入排序',
  nameEn: 'Insertion Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '直接插入排序将数组分为已排序和未排序两部分，每次从未排序部分取第一个元素，从后往前与已排序部分比较，找到合适位置插入。最好情况(已有序)只需比较n-1次O(n)；最坏情况(逆序)需要n(n-1)/2次比较O(n²)。是稳定排序。考研重点：手动模拟排序过程，理解从后往前比较的原因。',
  complexity: { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: '是' },
  keyPoints: ['从第二个元素开始，向前插入到有序序列', '最好情况(已有序)时间复杂度为O(n)', '是稳定排序', '考研高频考点：手动模拟排序过程'],
  rendererType: 'array',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {          // 从第二个元素开始
        int key = arr[i];                   // 暂存待插入元素
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {   // 从后往前找插入位置
            arr[j + 1] = arr[j];            // 比暂存值大的后移
            j--;
        }
        arr[j + 1] = key;                   // 插入到正确位置
    }
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = []; const sorted = [0];
    steps.push({ line: 1, phase: '初始化', description: `开始插入排序，第一个元素视为已排序`, data: { array: [...a] }, highlights: { sorted: [0] }, pointers: {} });

    for (let i = 1; i < n; i++) {
      const key = a[i];
      steps.push({ line: 2, phase: '取出元素', description: `取出 arr[${i}]=${key}，准备插入到前面的有序序列中`, data: { array: [...a] }, highlights: { active: [i], sorted: [...sorted] }, pointers: { i: { position: i, label: `i=${i}` } } });

      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        steps.push({ line: 5, phase: '比较后移', description: `arr[${j}]=${a[j]} > ${key}，将 ${a[j]} 后移一位`, data: { array: [...a] }, highlights: { comparing: [j, j + 1], sorted: sorted.filter(s => s < i) }, pointers: { j: { position: j, label: `j=${j}` } } });
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
      sorted.push(i);
      sorted.sort((x, y) => x - y);
      steps.push({ line: 8, phase: '插入', description: `将 ${key} 插入到位置 ${j + 1}`, data: { array: [...a] }, highlights: { found: [j + 1], sorted: [...sorted] }, pointers: {} });
    }

    steps.push({ line: 9, phase: '完成', description: '直接插入排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
