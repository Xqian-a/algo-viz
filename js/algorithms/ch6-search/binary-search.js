import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch6-binary-search',
  name: '折半查找',
  nameEn: 'Binary Search',
  chapter: 'ch6-search',
  chapterName: '查找',
  description: '折半查找(二分查找)在有序顺序表中，每次将查找区间缩小一半。取中间位置mid，若arr[mid]==key则成功；若arr[mid]<key则在右半部分继续；否则在左半部分继续。时间复杂度O(logn)。前提条件：①数据有序；②支持随机访问(顺序存储)。不适用于链表！考研重点：画判定树、计算ASL(平均查找长度)。',
  complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)', stable: '—' },
  keyPoints: ['要求有序表 + 顺序存储', '考研重点：画出判定树', '查找长度ASL的计算', '不适用于链表', '输入数据时最后一位为查找目标'],
  rendererType: 'array',
  defaultData: [5, 13, 19, 21, 37, 56, 64, 75, 80, 88, 92],
  sourceCode: `int BinarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;         // 初始化查找范围
    while (low <= high) {
        int mid = (low + high) / 2;    // 取中间位置
        if (arr[mid] == key)
            return mid;                 // 查找成功
        else if (arr[mid] < key)
            low = mid + 1;             // key在右半部分
        else
            high = mid - 1;            // key在左半部分
    }
    return -1;                         // 查找失败
}`,
  generateSteps(arr, searchKey) {
    const a = [...(arr || [5, 13, 19, 21, 37, 56, 64, 75, 80, 88, 92])].sort((x, y) => x - y);
    const key = (searchKey !== undefined && searchKey !== null) ? searchKey : 64;
    const n = a.length;
    const steps = [];
    let low = 0, high = n - 1;

    steps.push({ line: 1, phase: '初始化', description: `有序数组: [${a.join(', ')}]，查找 key=${key}，low=0，high=${high}`, data: { array: [...a] }, highlights: {}, pointers: { low: { position: 0, label: 'low=0' }, high: { position: high, label: `high=${high}` } } });

    let found = false;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({ line: 4, phase: '计算mid', description: `mid = (${low}+${high})/2 = ${mid}，arr[${mid}]=${a[mid]}`, data: { array: [...a] }, highlights: { active: [mid], comparing: Array.from({ length: high - low + 1 }, (_, i) => low + i) }, pointers: { low: { position: low, label: `low=${low}` }, mid: { position: mid, label: `mid=${mid}` }, high: { position: high, label: `high=${high}` } } });

      if (a[mid] === key) {
        steps.push({ line: 5, phase: '找到', description: `arr[${mid}]=${a[mid]} == ${key}，查找成功！`, data: { array: [...a] }, highlights: { found: [mid] }, pointers: {} });
        found = true;
        break;
      } else if (a[mid] < key) {
        steps.push({ line: 7, phase: '向右', description: `arr[${mid}]=${a[mid]} < ${key}，在右半部分继续，low = ${mid + 1}`, data: { array: [...a] }, highlights: { active: [mid] }, pointers: { low: { position: mid + 1, label: `low=${mid + 1}` }, high: { position: high, label: `high=${high}` } } });
        low = mid + 1;
      } else {
        steps.push({ line: 9, phase: '向左', description: `arr[${mid}]=${a[mid]} > ${key}，在左半部分继续，high = ${mid - 1}`, data: { array: [...a] }, highlights: { active: [mid] }, pointers: { low: { position: low, label: `low=${low}` }, high: { position: mid - 1, label: `high=${mid - 1}` } } });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({ line: 11, phase: '失败', description: `low=${low} > high=${high}，查找失败！${key} 不在数组中`, data: { array: [...a] }, highlights: {}, pointers: {} });
    }
    return steps;
  }
};

registry.register(entry);
export default entry;
