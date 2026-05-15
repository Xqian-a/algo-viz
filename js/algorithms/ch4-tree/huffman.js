import { registry } from '../../core/registry.js';

const entry = {
  id: 'ch4-huffman',
  name: '哈夫曼树',
  nameEn: 'Huffman Tree',
  chapter: 'ch4-tree',
  chapterName: '树与二叉树',
  description: '哈夫曼树是带权路径长度(WPL)最小的二叉树。构造方法：①将n个权值作为n棵只有根结点的树；②每次选权值最小的两棵树合并为新树(权值相加)；③重复直到只剩一棵树。特点：没有度为1的结点，共2n-1个结点。哈夫曼编码：左分支为0，右分支为1，从根到叶子的路径即为该字符的编码，是前缀编码。考研必考：手算WPL和哈夫曼编码。',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)', stable: '—' },
  keyPoints: ['WPL = 所有叶子结点的权值×路径长度之和', '构造方法：选最小两个合并', '没有度为1的结点', '哈夫曼编码是前缀编码', '考研必考：手算WPL和编码'],
  rendererType: 'tree',
  defaultData: null,
  sourceCode: `// 哈夫曼树构造（考研重点）
void CreateHuffmanTree(HuffmanTree &HT, int n) {
    for (int i = 1; i <= n; i++)         // 初始化 n 个叶子结点
        HT[i].weight = w[i];
    for (int i = n + 1; i <= 2 * n - 1; i++) {  // 生成 n-1 个新结点
        Select(HT, i - 1, &s1, &s2);    // 选权值最小的两个结点
        HT[s1].parent = i;              // 建立父子关系
        HT[s2].parent = i;
        HT[i].lchild = s1;              // 小的做左孩子
        HT[i].rchild = s2;             // 大的做右孩子
        HT[i].weight = HT[s1].weight + HT[s2].weight; // 合并权值
    }
}`,
  generateSteps() {
    const weights = [5, 29, 7, 8, 14, 23, 3, 11];
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const treeData = {
      root: 100,
      nodes: [
        { id: 100, value: 100, left: 42, right: 58 },
        { id: 42, value: 42, left: 19, right: 23 },
        { id: 58, value: 58, left: 25, right: 33 },
        { id: 19, value: 19, left: 8, right: 11 },
        { id: 23, value: '23:f', left: null, right: null },
        { id: 25, value: 25, left: 12, right: 13 },
        { id: 33, value: 33, left: 15, right: 18 },
        { id: 8, value: '8:d', left: null, right: null },
        { id: 11, value: '11:h', left: null, right: null },
        { id: 12, value: '12:e', left: null, right: null },
        { id: 13, value: '13:b', left: null, right: null },
        { id: 15, value: '15:c', left: null, right: null },
        { id: 18, value: '18:a', left: null, right: null },
      ],
      edgeLabels: [[100, 42, '0'], [100, 58, '1'], [42, 19, '0'], [42, 23, '1'], [58, 25, '0'], [58, 33, '1']]
    };

    const steps = [];
    steps.push({ line: 1, phase: '初始化', description: `权值: ${chars.map((c, i) => `${c}=${weights[i]}`).join(', ')}`, data: { tree: treeData }, highlights: {} });

    const pairs = [
      { msg: '选最小两个：g=3 和 d=8，合并为 11', n1: 19 },
      { msg: '选最小两个：11 和 h=11，合并为 19(已合并)', n1: 19 },
      { msg: '选最小两个：e=12 和 b=13，合并为 25', n1: 25 },
      { msg: '选最小两个：c=15 和 a=18，合并为 33', n1: 33 },
      { msg: '选最小两个：19 和 f=23，合并为 42', n1: 42 },
      { msg: '选最小两个：25 和 33，合并为 58', n1: 58 },
      { msg: '选最小两个：42 和 58，合并为 100（根结点）', n1: 100 },
    ];

    for (const p of pairs) {
      steps.push({ line: 7, phase: '合并', description: p.msg, data: { tree: treeData }, highlights: { active: [p.n1] } });
    }

    steps.push({ line: 13, phase: '完成', description: `哈夫曼树构建完成，WPL = ${5 * 4 + 29 * 2 + 7 * 4 + 8 * 4 + 14 * 3 + 23 * 2 + 3 * 4 + 11 * 3}`, data: { tree: treeData }, highlights: { sorted: treeData.nodes.map(n => n.id) } });
    return steps;
  }
};

registry.register(entry);
export default entry;
