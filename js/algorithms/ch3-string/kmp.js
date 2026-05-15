import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch3-kmp',
  name: 'KMP算法',
  nameEn: 'KMP Algorithm',
  chapter: 'ch3-string',
  chapterName: '串',
  description: 'KMP算法是字符串匹配的经典算法，核心思想是利用已匹配的信息避免主串指针回退。next数组(next[j]=k)表示模式串中第j个字符前面的子串中，最长相等前后缀的长度为k。当失配时，j回退到next[j]而i不动，将时间复杂度从暴力的O(mn)降到O(m+n)。考研必考：手算next数组和nextval数组，理解"最长相等前后缀"的概念。',
  complexity: { time: { best: 'O(m+n)', average: 'O(m+n)', worst: 'O(m+n)' }, space: 'O(m)', stable: '—' },
  keyPoints: ['考研字符串部分的绝对重点', 'next数组的求法是必考题', 'nextval数组是next的优化版', '理解"最长相等前后缀"的概念', '时间复杂度证明'],
  rendererType: 'string',
  defaultData: null,
  sourceCode: `// 求 next 数组（部分匹配表）
void getNext(char *pattern, int next[]) {
    int j = 0, k = -1;
    next[0] = -1;
    while (j < strlen(pattern) - 1) {
        if (k == -1 || pattern[j] == pattern[k]) {
            j++; k++;
            next[j] = k;              // next[j]=k：最长相等前后缀长度
        } else {
            k = next[k];              // 不匹配则k回退
        }
    }
}

// KMP 匹配算法
int KMP(char *text, char *pattern, int next[]) {
    int i = 0, j = 0;
    int n = strlen(text), m = strlen(pattern);
    while (i < n && j < m) {
        if (j == -1 || text[i] == pattern[j]) {
            i++; j++;                 // 匹配则i和j都前进
        } else {
            j = next[j];              // 失配：j回退到next[j]，i不回退
        }
    }
    if (j >= m) return i - m;         // 匹配成功，返回起始位置
    return -1;                        // 匹配失败
}`,
  generateSteps() {
    const text = 'ABABDABACDABABCABAB';
    const pattern = 'ABABCABAB';
    const steps = [];
    const n = text.length, m = pattern.length;

    // Build next array
    const next = new Array(m).fill(-1);
    let jj = 0, kk = -1;
    next[0] = -1;
    steps.push({ line: 1, phase: '构建next', description: '开始构建 next 数组', data: { text, pattern, nextArr: [...next] }, highlights: {}, pointers: {} });

    while (jj < m - 1) {
      if (kk === -1 || pattern[jj] === pattern[kk]) {
        jj++; kk++;
        next[jj] = kk;
        steps.push({ line: 6, phase: '构建next', description: `next[${jj}] = ${kk}（最长相等前后缀长度）`, data: { text, pattern, nextArr: [...next] }, highlights: { matched: [] }, pointers: { i: { position: jj, label: `j=${jj}` }, j: { position: kk, label: `k=${kk}` } } });
      } else {
        kk = next[kk];
        steps.push({ line: 9, phase: '回退k', description: `k = next[${kk}] = ${kk}`, data: { text, pattern, nextArr: [...next] }, highlights: {}, pointers: {} });
      }
    }

    // KMP search
    let i = 0, j = 0;
    let offset = 0;
    steps.push({ line: 14, phase: '开始匹配', description: `开始KMP匹配，主串长度=${n}，模式串长度=${m}`, data: { text, pattern, offset: 0, nextArr: [...next] }, highlights: {}, pointers: { i: { position: 0, label: 'i=0' }, j: { position: 0, label: 'j=0' } } });

    while (i < n && j < m) {
      offset = i - j;
      if (j === -1 || text[i] === pattern[j]) {
        if (j === -1) {
          steps.push({ line: 18, phase: '跳过', description: `j=-1，i++ j++ 同时前进`, data: { text, pattern, offset: i + 1, nextArr: [...next] }, highlights: {}, pointers: { i: { position: i + 1, label: `i=${i + 1}` }, j: { position: 0, label: 'j=0' } } });
        } else {
          steps.push({ line: 18, phase: '匹配', description: `text[${i}]='${text[i]}' == pattern[${j}]='${pattern[j]}' ✓`, data: { text, pattern, offset, nextArr: [...next], matched: Array.from({ length: j + 1 }, (_, k) => offset + k) }, highlights: { matched: Array.from({ length: j + 1 }, (_, k) => offset + k), patternMatched: Array.from({ length: j + 1 }, (_, k) => k) }, pointers: { i: { position: i, label: `i=${i}` }, j: { position: j, label: `j=${j}` } } });
        }
        i++; j++;
      } else {
        steps.push({ line: 20, phase: '失配', description: `text[${i}]='${text[i]}' != pattern[${j}]='${pattern[j]}' ✗，j=next[${j}]=${next[j]}`, data: { text, pattern, offset, nextArr: [...next], mismatch: [i], patternMismatch: [j] }, highlights: { mismatch: [i], patternMismatch: [j] }, pointers: { i: { position: i, label: `i=${i}` }, j: { position: j, label: `j→${next[j]}` } } });
        j = next[j];
      }
    }

    if (j >= m) {
      steps.push({ line: 23, phase: '匹配成功', description: `匹配成功！位置在 text[${i - m}]，即第 ${i - m + 1} 个字符`, data: { text, pattern, offset: i - m, nextArr: [...next] }, highlights: { found: Array.from({ length: m }, (_, k) => i - m + k) }, pointers: {} });
    }

    return steps;
  }
};

registry.register(entry);
export default entry;
