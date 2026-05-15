import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-shell-sort',
  name: '希尔排序',
  nameEn: 'Shell Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '希尔排序是插入排序的改进版，也叫缩小增量排序。先取一个增量gap=n/2，将数组分为gap组，每组内做插入排序；然后缩小增量gap=gap/2，重复直到gap=1。增量序列的选择影响性能，常用n/2递减序列。平均时间复杂度约O(n^1.3)。不是稳定排序。考研重点：理解分组插入的过程。',
  complexity: { time: { best: 'O(n log n)', average: 'O(n^1.3)', worst: 'O(n²)' }, space: 'O(1)', stable: '否' },
  keyPoints: ['增量序列的选择影响性能', '常用增量：n/2, n/4, ..., 1', '不是稳定排序', '考研重点：理解分组插入的过程'],
  rendererType: 'array',
  defaultData: [64, 34, 25, 12, 22, 11, 90],
  sourceCode: `void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) { // 初始增量为n/2，逐步缩小
        for (int i = gap; i < n; i++) {          // 对每组进行插入排序
            int temp = arr[i];                    // 暂存当前元素
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];            // 组内元素后移
            }
            arr[j] = temp;                        // 插入到正确位置
        }
    }
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = [];
    steps.push({ line: 1, phase: '初始化', description: `开始希尔排序，数组长度 n=${n}`, data: { array: [...a] }, highlights: {}, pointers: {} });

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      steps.push({ line: 2, phase: '增量', description: `当前增量 gap=${gap}，将数组分为 ${gap} 组`, data: { array: [...a] }, highlights: {}, pointers: { gap: { position: 0, label: `gap=${gap}` } } });

      for (let i = gap; i < n; i++) {
        const temp = a[i];
        steps.push({ line: 3, phase: '取出', description: `取出 arr[${i}]=${temp}，在间隔 ${gap} 的组中插入`, data: { array: [...a] }, highlights: { active: [i] }, pointers: { i: { position: i, label: `i=${i}` } } });

        let j;
        for (j = i; j >= gap && a[j - gap] > temp; j -= gap) {
          steps.push({ line: 6, phase: '后移', description: `arr[${j - gap}]=${a[j - gap]} > ${temp}，后移`, data: { array: [...a] }, highlights: { comparing: [j, j - gap] }, pointers: {} });
          a[j] = a[j - gap];
        }
        a[j] = temp;
        if (j !== i) {
          steps.push({ line: 8, phase: '插入', description: `将 ${temp} 插入到位置 ${j}`, data: { array: [...a] }, highlights: { found: [j] }, pointers: {} });
        }
      }
    }

    steps.push({ line: 9, phase: '完成', description: '希尔排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
