import { $, showToast } from '../utils/dom.js';
import { eventBus } from '../core/event-bus.js';
import { registry } from '../core/registry.js';

const PATTERNS = [
  { regex: /for.*for.*swap|arr\[j\]\s*>\s*arr\[j\s*\+\s*1\]/i, id: 'ch7-bubble-sort', name: '冒泡排序' },
  { regex: /minIdx|min.*=.*i|arr\[j\]\s*<\s*arr\[min/i, id: 'ch7-selection-sort', name: '选择排序' },
  { regex: /key\s*=\s*arr\[i\]|while.*j\s*>=\s*0.*arr\[j\]\s*>\s*key/i, id: 'ch7-insertion-sort', name: '直接插入排序' },
  { regex: /gap\s*=\s*n\s*\/\s*2|shell/i, id: 'ch7-shell-sort', name: '希尔排序' },
  { regex: /merge|void\s+merge/i, id: 'ch7-merge-sort', name: '归并排序' },
  { regex: /partition|pivot|quick/i, id: 'ch7-quick-sort', name: '快速排序' },
  { regex: /heapify|heap|2\s*\*\s*i/i, id: 'ch7-heap-sort', name: '堆排序' },
  { regex: /next\[|kmp|pattern/i, id: 'ch3-kmp', name: 'KMP算法' },
  { regex: /binary.*search|low.*high.*mid/i, id: 'ch6-binary-search', name: '折半查找' },
  { regex: /preOrder|inOrder|postOrder|visit\(T\)/i, id: 'ch4-tree-traversal', name: '二叉树遍历' },
  { regex: /DFS|visited.*DFS/i, id: 'ch5-dfs', name: '深度优先搜索' },
  { regex: /BFS|EnQueue.*BFS|Queue.*BFS/i, id: 'ch5-bfs', name: '广度优先搜索' },
  { regex: /dijkstra|dist\[|shortest/i, id: 'ch5-dijkstra', name: 'Dijkstra算法' },
  { regex: /prim|lowcost/i, id: 'ch5-prim', name: 'Prim算法' },
  { regex: /kruskal|Union.*Find/i, id: 'ch5-kruskal', name: 'Kruskal算法' },
];

export function initUserCodeUpload() {
  const overlay = $('#modal-overlay');
  const closeBtn = $('#modal-close');
  const cancelBtn = $('#btn-cancel-upload');
  const analyzeBtn = $('#btn-analyze-code');
  const uploadBtn = $('#btn-upload');
  const codeInput = $('#upload-code');
  const dataInput = $('#upload-data');
  const resultDiv = $('#upload-result');

  function show() { overlay?.classList.add('open'); resultDiv.className = 'upload-result'; resultDiv.textContent = ''; }
  function hide() { overlay?.classList.remove('open'); }

  uploadBtn?.addEventListener('click', show);
  eventBus.on('show-upload-modal', show);
  closeBtn?.addEventListener('click', hide);
  cancelBtn?.addEventListener('click', hide);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) hide(); });

  analyzeBtn?.addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (!code) { showToast('请粘贴代码', 'error'); return; }

    // Try pattern matching
    let matched = null;
    for (const p of PATTERNS) {
      if (p.regex.test(code)) { matched = p; break; }
    }

    if (matched) {
      const algo = registry.get(matched.id);
      resultDiv.className = 'upload-result show success';
      resultDiv.textContent = `✅ 识别为：${matched.name}(${algo?.nameEn || ''})。将使用内置可视化引擎演示。`;
      setTimeout(() => {
        hide();
        eventBus.emit('algorithm-selected', { id: matched.id });
      }, 1500);
    } else {
      resultDiv.className = 'upload-result show warning';
      resultDiv.textContent = '⚠️ 未识别算法类型。将仅显示代码（带语法高亮），暂无可视化步骤。';
      setTimeout(() => {
        hide();
        eventBus.emit('show-user-code', { code, data: dataInput.value });
      }, 1500);
    }
  });
}
