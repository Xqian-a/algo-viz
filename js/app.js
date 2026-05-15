// Import core modules
import { eventBus } from './core/event-bus.js';
import { registry } from './core/registry.js';
import { stepEngine } from './core/step-engine.js';
import { canvasManager } from './core/canvas-manager.js';
import { state } from './core/state-store.js';

// Import renderers
import { ArrayRenderer } from './renderers/array-renderer.js';
import { LinkedListRenderer } from './renderers/linked-list-renderer.js';
import { StackRenderer } from './renderers/stack-renderer.js';
import { QueueRenderer } from './renderers/queue-renderer.js';
import { TreeRenderer } from './renderers/tree-renderer.js';
import { GraphRenderer } from './renderers/graph-renderer.js';
import { StringRenderer } from './renderers/string-renderer.js';
import { HashRenderer } from './renderers/hash-renderer.js';

// Import UI
import { initSidebar } from './ui/sidebar.js';
import { initCodePanel, updateCodeDisplay, highlightLine } from './ui/code-panel.js';
import { initControlBar } from './ui/control-bar.js';
import { initInfoPanel } from './ui/info-panel.js';
import { initUserCodeUpload } from './ui/user-code-upload.js';
import { $, showToast } from './utils/dom.js';
import { RENDERER_TYPES } from './utils/constants.js';

// Import all algorithm chapters (triggers self-registration)
import './algorithms/ch1-linear-list/index.js';
import './algorithms/ch2-stack-queue/index.js';
import './algorithms/ch3-string/index.js';
import './algorithms/ch4-tree/index.js';
import './algorithms/ch5-graph/index.js';
import './algorithms/ch6-search/index.js';
import './algorithms/ch7-sort/index.js';

// Renderer map
const rendererMap = {};
let currentRenderer = null;

function createRenderers() {
  rendererMap[RENDERER_TYPES.ARRAY] = new ArrayRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.LINKED_LIST] = new LinkedListRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.STACK] = new StackRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.QUEUE] = new QueueRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.TREE] = new TreeRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.GRAPH] = new GraphRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.STRING] = new StringRenderer(canvasManager);
  rendererMap[RENDERER_TYPES.HASH] = new HashRenderer(canvasManager);
}

function getRenderer(type) {
  return rendererMap[type] || rendererMap[RENDERER_TYPES.ARRAY];
}

// Search algorithms that support custom search key
const SEARCH_ALGO_IDS = new Set(['ch6-binary-search', 'ch6-bst-search', 'ch6-hash-search']);

// Update info panel directly (no event emission)
function showAlgoInfoForPanel(id) {
  const algo = registry.get(id);
  const content = $('#info-content');
  const panel = $('#info-panel');
  if (!algo || !content || !panel) return;
  const timeEntries = Object.entries(algo.complexity.time).map(([k, v]) => {
    const label = k === 'best' ? '最好' : k === 'average' ? '平均' : '最坏';
    return `<span class="complexity-item"><span class="complexity-label">${label}:</span><span class="complexity-value">${v}</span></span>`;
  }).join('');
  content.innerHTML = `
    <h3>${algo.name} <span style="color:var(--text-muted);font-weight:400;font-size:0.85rem">${algo.nameEn}</span></h3>
    <div class="complexity">${timeEntries}<span class="complexity-item"><span class="complexity-label">空间:</span><span class="complexity-value">${algo.complexity.space}</span></span>${algo.complexity.stable ? `<span class="complexity-item"><span class="complexity-label">稳定性:</span><span class="complexity-value">${algo.complexity.stable}</span></span>` : ''}</div>
    <p class="description">${algo.description}</p>
    ${algo.keyPoints?.length ? `<div class="key-points"><h4>考研要点</h4><ul>${algo.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
  `;
  panel.classList.add('open');
  panel.style.maxHeight = '160px';
}

// Load algorithm — fast: steps + render sync, code highlight deferred
function loadAlgorithm(id, customSearchKey) {
  const algo = registry.get(id);
  if (!algo) return;

  stepEngine.pause();
  state.setAlgorithm(algo, algo.defaultData);
  currentRenderer = getRenderer(algo.rendererType);

  // Update title (instant)
  const titleEl = $('#viz-title');
  const badgeEl = $('#viz-badge');
  if (titleEl) titleEl.textContent = `${algo.name} — ${algo.nameEn}`;
  if (badgeEl) badgeEl.textContent = algo.chapterName;
  const placeholder = $('#viz-placeholder');
  if (placeholder) placeholder.classList.add('hidden');

  // Show/hide search key input
  const searchSection = $('#search-key-section');
  if (searchSection) {
    if (SEARCH_ALGO_IDS.has(id)) {
      searchSection.style.display = 'flex';
      const searchInput = $('#search-key-input');
      if (searchInput && customSearchKey === undefined) {
        // Set default search key
        const defaults = { 'ch6-binary-search': 64, 'ch6-bst-search': 60, 'ch6-hash-search': 27 };
        searchInput.value = defaults[id] || '';
      }
    } else {
      searchSection.style.display = 'none';
    }
  }

  // Generate steps + render (sync, fast ~0ms)
  const data = algo.defaultData || getDefaultDataForAlgo(algo);
  stepEngine.load(algo, data, customSearchKey);
  const step = stepEngine.getCurrentStep();
  if (step && currentRenderer) currentRenderer.render(step);
  if (step) updateStepDescription(step);

  // Notify info panel directly (no event to avoid recursion)
  showAlgoInfoForPanel(id);

  // Defer ONLY code highlighting (the slow part ~3ms)
  requestAnimationFrame(() => {
    updateCodeDisplay(algo.sourceCode, step ? step.line : -1);
  });
}

function getDefaultDataForAlgo(algo) {
  // Some algorithms don't use array data
  return null;
}

// Update step description
function updateStepDescription(step) {
  const descEl = $('#step-desc-text');
  const container = $('#step-description');
  if (!descEl || !container) return;

  if (step?.description) {
    descEl.textContent = step.description;
    container.classList.remove('hidden');
  } else {
    container.classList.add('hidden');
  }
}

// Data edit modal
function initDataModal() {
  const overlay = $('#data-modal-overlay');
  const closeBtn = $('#data-modal-close');
  const cancelBtn = $('#btn-cancel-data');
  const applyBtn = $('#btn-apply-data');
  const randomBtn = $('#btn-random-data');
  const input = $('#data-edit-input');
  const label = $('#data-edit-label');

  function show() {
    if (!state.currentAlgorithm) { showToast('请先选择一个算法', 'error'); return; }
    const algo = state.currentAlgorithm;
    if (algo.defaultData && Array.isArray(algo.defaultData)) {
      input.value = algo.defaultData.join(', ');
      label.textContent = '输入数据（逗号分隔的数字）';
    } else {
      input.value = '';
      label.textContent = '此算法不支持自定义数据';
    }
    overlay?.classList.add('open');
  }

  function hide() { overlay?.classList.remove('open'); }

  eventBus.on('show-data-modal', show);
  closeBtn?.addEventListener('click', hide);
  cancelBtn?.addEventListener('click', hide);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) hide(); });

  applyBtn?.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    const data = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (data.length === 0) { showToast('请输入有效的数字', 'error'); return; }
    state.setData(data);
    stepEngine.load(state.currentAlgorithm, data);
    hide();
    showToast('数据已更新', 'success');
  });

  randomBtn?.addEventListener('click', () => {
    const size = 8 + Math.floor(Math.random() * 5);
    const data = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    input.value = data.join(', ');
  });
}

// User code display
function initUserCodeHandler() {
  eventBus.on('show-user-code', ({ code, data }) => {
    const titleEl = $('#viz-title');
    const badgeEl = $('#viz-badge');
    if (titleEl) titleEl.textContent = '用户自定义代码';
    if (badgeEl) badgeEl.textContent = '自定义';

    updateCodeDisplay(code, -1);
    showToast('代码已加载（仅显示模式）', 'info');
  });
}

// Canvas resize handler
function handleResize() {
  const step = stepEngine.getCurrentStep();
  if (step && currentRenderer) {
    currentRenderer.render(step);
  }
}

// Initialize
function init() {
  // Init canvas
  const canvas = $('#viz-canvas');
  if (canvas) {
    canvasManager.init(canvas, handleResize);
  }

  createRenderers();

  // Init UI components
  initSidebar();
  initCodePanel();
  initControlBar();
  initInfoPanel();
  initUserCodeUpload();
  initDataModal();
  initUserCodeHandler();

  // Search key input handler
  const searchBtn = $('#btn-search-go');
  const searchInput = $('#search-key-input');
  function doSearch() {
    if (!state.currentAlgorithm || !SEARCH_ALGO_IDS.has(state.currentAlgorithm.id)) return;
    const val = searchInput ? parseInt(searchInput.value, 10) : NaN;
    if (isNaN(val)) return;
    loadAlgorithm(state.currentAlgorithm.id, val);
  }
  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

  // Wire step engine events to renderer
  eventBus.on('step-changed', ({ step, index }) => {
    if (!step) return;
    if (currentRenderer) currentRenderer.render(step);
    updateStepDescription(step);
    // Defer code line highlight (Prism DOM lookup)
    requestAnimationFrame(() => highlightLine(step.line));
  });

  eventBus.on('steps-loaded', ({ steps, algorithm, currentIndex }) => {
    if (steps.length > 0 && currentRenderer) {
      currentRenderer.render(steps[0]);
    }
  });

  // Algorithm selection from sidebar (only, not from loadAlgorithm)
  eventBus.on('algorithm-selected', ({ id }) => {
    if (state.currentAlgorithmId !== id) loadAlgorithm(id);
  });

  // Auto-select first algorithm for demo
  const all = registry.getAll();
  if (all.length > 0) {
    // Select first sorting algorithm as default
    const first = registry.get('ch7-bubble-sort') || all[0];
    setTimeout(() => {
      loadAlgorithm(first.id);
      // Mark sidebar item as active
      const item = document.querySelector(`.algo-item[data-id="${first.id}"]`);
      if (item) item.classList.add('active');
    }, 100);
  }
}

// Start when DOM is ready — guard against multiple init calls
let _initialized = false;
function safeInit() {
  if (_initialized) return;
  _initialized = true;
  try {
    init();
  } catch (e) {
    console.error('[App] Init error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit, { once: true });
} else {
  safeInit();
}
