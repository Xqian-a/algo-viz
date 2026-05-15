import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch7-radix-sort',
  name: '基数排序',
  nameEn: 'Radix Sort',
  chapter: 'ch7-sort',
  chapterName: '排序',
  description: '基数排序(LSD)按位排序，从最低位到最高位，每位使用稳定的排序(通常用计数排序)。经过d轮(d为最大数的位数)后得到有序序列。时间复杂度O(d(n+k))，k为基数(通常10)。是稳定排序。考研重点：理解"分配"和"收集"的过程，掌握LSD和MSD的区别。',
  complexity: { time: { best: 'O(d(n+k))', average: 'O(d(n+k))', worst: 'O(d(n+k))' }, space: 'O(n+k)', stable: '是' },
  keyPoints: ['非比较类排序，按位分配收集', 'd为位数，k为基数(通常10)', '需要稳定的子排序算法', '是稳定排序', '考研重点：理解分配和收集的过程'],
  rendererType: 'array',
  defaultData: [170, 45, 75, 90, 802, 24, 2, 66],
  sourceCode: `// 按某一位进行计数排序
void countingSortByDigit(int arr[], int n, int exp) {
    int output[n], count[10] = {0};
    for (int i = 0; i < n; i++)                 // 统计当前位的频率
        count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++)                // 累加计数
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {          // 反向填充保证稳定性
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    for (int i = 0; i < n; i++)                 // 收集回原数组
        arr[i] = output[i];
}

// 基数排序：LSD 从低位到高位
void radixSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max) max = arr[i];
    for (int exp = 1; max / exp > 0; exp *= 10) // 按个、十、百...位排序
        countingSortByDigit(arr, n, exp);
}`,
  generateSteps(arr) {
    const a = [...arr]; const n = a.length; const steps = [];
    const maxVal = Math.max(...a);
    steps.push({ line: 14, phase: '初始化', description: `开始基数排序，最大值=${maxVal}`, data: { array: [...a] }, highlights: {}, pointers: {} });

    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
      const digitName = exp === 1 ? '个' : exp === 10 ? '十' : exp === 100 ? '百' : `${exp}位`;
      steps.push({ line: 18, phase: '按位排序', description: `按${digitName}位排序 (exp=${exp})`, data: { array: [...a] }, highlights: {}, pointers: {} });

      const count = new Array(10).fill(0);
      for (let i = 0; i < n; i++) {
        const digit = Math.floor(a[i] / exp) % 10;
        count[digit]++;
        steps.push({ line: 4, phase: '统计', description: `arr[${i}]=${a[i]}，${digitName}位=${digit}，count[${digit}]++`, data: { array: [...a] }, highlights: { active: [i] }, pointers: {} });
      }

      for (let i = 1; i < 10; i++) count[i] += count[i - 1];

      const output = new Array(n);
      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(a[i] / exp) % 10;
        output[count[digit] - 1] = a[i];
        count[digit]--;
      }

      for (let i = 0; i < n; i++) a[i] = output[i];
      steps.push({ line: 12, phase: '收集', description: `按${digitName}位排序完成：${a.join(', ')}`, data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    }

    steps.push({ line: 18, phase: '完成', description: '基数排序完成！', data: { array: [...a] }, highlights: { sorted: Array.from({ length: n }, (_, i) => i) }, pointers: {} });
    return steps;
  }
};

registry.register(entry);
export default entry;
