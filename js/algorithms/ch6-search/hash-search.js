import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch6-hash-search',
  name: '散列表查找',
  nameEn: 'Hash Search',
  chapter: 'ch6-search',
  chapterName: '查找',
  description: '散列表(哈希表)通过散列函数H(key)直接计算元素的存储位置，理想情况下查找时间O(1)。当两个不同的key映射到同一位置时产生冲突。冲突处理：①开放定址法(线性探测、二次探测)；②链地址法(拉链法)。装填因子α=已存元素数/表长，α越大冲突越多。考研重点：除留余数法H(key)=key%p，手算线性探测建表过程。',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' }, space: 'O(n)', stable: '—' },
  keyPoints: ['装填因子α = 已存元素/表长', '冲突处理：开放定址法、链地址法', '散列函数设计：除留余数法', '查找效率与装填因子有关'],
  rendererType: 'hash',
  defaultData: null,
  keyPoints: ['装填因子α = 已存元素/表长', '冲突处理：开放定址法、链地址法', '散列函数设计：除留余数法', '查找效率与装填因子有关', '输入查找目标后点击查找'],
  sourceCode: `// 除留余数法 H(key) = key % p
int Hash(KeyType key, int p) {
    return key % p;
}

// 线性探测法解决冲突
int HashSearch(HashTable HT, KeyType key) {
    int addr = Hash(key, p);
    while (HT[addr] != key && HT[addr] != NULL) {
        addr = (addr + 1) % TableSize;
    }
    return addr;
}`,
  generateSteps(arr, searchKey) {
    const keys = [19, 14, 23, 1, 68, 20, 84, 27, 55, 11];
    const tableSize = 13;
    const table = new Array(tableSize).fill(null);
    const steps = [];

    steps.push({ line: 1, phase: '初始化', description: `散列表大小=${tableSize}，H(key) = key % ${tableSize}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: {} });

    for (const key of keys) {
      let addr = key % tableSize;
      let probes = 0;
      steps.push({ line: 2, phase: '计算地址', description: `插入 ${key}：H(${key}) = ${key} % ${tableSize} = ${addr}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { active: [addr] } });

      while (table[addr] !== null) {
        probes++;
        steps.push({ line: 8, phase: '冲突', description: `位置 ${addr} 已被 ${table[addr]} 占用，线性探测 → ${(addr + 1) % tableSize}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { comparing: [addr] } });
        addr = (addr + 1) % tableSize;
      }

      table[addr] = key;
      steps.push({ line: 10, phase: '插入', description: `将 ${key} 放入位置 ${addr}${probes > 0 ? `（经过 ${probes} 次探测）` : ''}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { found: [addr] } });
    }

    steps.push({ line: 11, phase: '建表完成', description: `散列表构建完成，装填因子 α = ${keys.length}/${tableSize} = ${(keys.length / tableSize).toFixed(2)}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { sorted: Array.from({ length: tableSize }, (_, i) => i).filter(i => table[i] !== null) } });

    // Search phase
    if (searchKey !== undefined && searchKey !== null) {
      let addr = searchKey % tableSize;
      let probes = 0;
      steps.push({ line: 12, phase: '查找', description: `开始查找 key=${searchKey}，H(${searchKey}) = ${searchKey} % ${tableSize} = ${addr}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { active: [addr] } });

      while (table[addr] !== null && table[addr] !== searchKey) {
        probes++;
        steps.push({ line: 13, phase: '探测', description: `位置 ${addr} 存放的是 ${table[addr]} ≠ ${searchKey}，线性探测 → ${(addr + 1) % tableSize}`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { comparing: [addr] } });
        addr = (addr + 1) % tableSize;
      }

      if (table[addr] === searchKey) {
        steps.push({ line: 14, phase: '找到', description: `位置 ${addr} 存放 ${searchKey}，查找成功！经过 ${probes + 1} 次比较`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { found: [addr] } });
      } else {
        steps.push({ line: 15, phase: '失败', description: `位置 ${addr} 为空，${searchKey} 不在散列表中，查找失败！`, data: { table: [...table], meta: { hashFunc: `key % ${tableSize}` } }, highlights: { comparing: [addr] } });
      }
    }

    return steps;
  }
};

registry.register(entry);
export default entry;
