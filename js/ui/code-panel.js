import { $, createElement } from '../utils/dom.js';
import { eventBus } from '../core/event-bus.js';

export function initCodePanel() {
  const copyBtn = $('#btn-copy-code');
  const toggleBtn = $('#btn-toggle-code');
  const panel = $('#code-panel');

  if (!panel) return;

  // Create resize handle
  const handle = createElement('div', { className: 'resize-handle' });
  panel.insertBefore(handle, panel.firstChild);

  // Create expand tab (shown when collapsed)
  const expandTab = createElement('div', { className: 'expand-tab' });
  expandTab.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
  expandTab.addEventListener('click', () => expandPanel());
  panel.appendChild(expandTab);

  // Toggle (collapse)
  toggleBtn?.addEventListener('click', () => collapsePanel());

  // Copy code
  copyBtn?.addEventListener('click', () => {
    const code = $('#code-content')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓';
        setTimeout(() => copyBtn.innerHTML = orig, 1500);
      });
    }
  });

  // Resize via drag
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const diff = startX - e.clientX; // dragging left increases width
    const newWidth = Math.max(200, Math.min(700, startWidth + diff));
    panel.style.width = newWidth + 'px';
    document.documentElement.style.setProperty('--code-panel-width', newWidth + 'px');
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    handle.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  let lastWidth = '380px';

  function collapsePanel() {
    lastWidth = panel.style.width || '380px';
    panel.classList.add('collapsed');
  }

  function expandPanel() {
    panel.classList.remove('collapsed');
    panel.style.width = lastWidth;
    document.documentElement.style.setProperty('--code-panel-width', lastWidth);
  }
}

export function updateCodeDisplay(sourceCode, activeLine = -1) {
  const codeEl = $('#code-content');
  const displayEl = $('#code-display');
  if (!codeEl || !displayEl) return;

  codeEl.textContent = sourceCode;
  codeEl.className = 'language-cpp';

  // Defer Prism highlighting to next frame
  requestAnimationFrame(() => {
    if (window.Prism) window.Prism.highlightElement(codeEl);
    requestAnimationFrame(() => highlightLine(activeLine));
  });
}

export function highlightLine(lineNumber) {
  const displayEl = $('#code-display');
  if (!displayEl) return;

  // Remove existing highlights
  displayEl.querySelectorAll('.active-line').forEach(el => el.classList.remove('active-line'));

  if (lineNumber < 0) return;

  // Try Prism line-numbers spans first
  const lineSpans = displayEl.querySelectorAll('.line-numbers-rows > span');
  if (lineSpans.length > 0 && lineNumber > 0 && lineNumber <= lineSpans.length) {
    const span = lineSpans[lineNumber - 1];
    span.classList.add('active-line');
    span.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
