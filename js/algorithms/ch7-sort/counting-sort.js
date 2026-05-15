import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-counting-sort',
  name: '计数排序',
  nameEn: 'Counting Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '计数排序是一种非比较类排序。统计每个值出现的次数到计数数组count中，然后累加count确定每个值的最终位置，最后反向填充到输出数组。时间复杂度O(n+k)，k为值域范围。需要O(k)额外空间。是稳定排序(反向填充保证)。适用场景：值域较小的非负整数排序。',
  complexity: { time: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' }, space: 'O(k)', stable: '是' },
  keyPoints: ['非比较类排序算法', '时间复杂度为O(n+k)，k为值域范围', '需要额外O(k)空间', '是稳定排序', '适用于值域较小的整数排序'],
  rendererType: 'array',
  defaultData: [4, 2, 2, 8, 3, 3, 1],
  sourceCode: `void countingSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)         // 找最大值确定范围
        if (arr[i] > max) max = arr[i];
    int count[max + 1];                 // 初始化计数数组
    memset(count, 0, sizeof(count));
    for (int i = 0; i < n; i++)         // 统计每个值出现次数
        count[arr[i]]++;
    for (int i = 1; i <= max; i++)      // 累加计数，确定最终位置
        count[i] += count[i - 1];
    int output[n];
    for (int i = n - 1; i >= 0; i--) {  // 反向填充保证稳定性
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    for (int i = 0; i < n; i++)         // 收集回原数组
        arr[i] = output[i];
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = [];
    const max = Math.max(...a);
    steps.push({ line: 1, phase: '初始化', description: `开始计数排序，最大值 max=${max}`, data: { array: [...a] }, highlights: {}, pointers: {} });

    const count = new Array(max + 1).fill(0);
    steps.push({ line: 6, phase: '初始化计数', description: `创建计数数组 count[0..${max}]，初始化为0`, data: { array: [...a] }, highlights: {}, pointers: {} });

    for (let i = 0; i < n; i++) {
      count[a[i]]++;
      steps.push({ line: 8, phase: '计数', description: `arr[${i}]=${a[i]}，count[${a[i]}]++ → ${count[a[i]]}`, data: { array: [...a] }, highlights: { active: [i] }, pointers: {} });
    }

    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
      steps.push({ line: 10, phase: '累加', description: `count[${i}] += count[${i - 1}] → ${count[i]}`, data: { array: [...a] }, highlights: {}, pointers: {} });
    }

    const output = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      output[count[a[i]] - 1] = a[i];
      count[a[i]]--;
      steps.push({ line: 13, phase: '放置', description: `将 arr[${i}]=${a[i]} 放到输出位置 ${count[a[i]]}`, data: { array: [...output.filter(x => x !== undefined)] }, highlights: { found: [count[a[i]]] }, pointers: {} });
    }

    for (let i = 0; i < n; i++) a[i] = output[i];
    steps.push({ line: 17, phase: '完成', description: '计数排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
