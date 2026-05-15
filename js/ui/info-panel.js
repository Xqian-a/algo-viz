import { $, createElement } from '../utils/dom.js';
import { eventBus } from '../core/event-bus.js';
import { registry } from '../core/registry.js';

export function initInfoPanel() {
  const panel = $('#info-panel');
  const content = $('#info-content');
  const dataBtn = $('#btn-data-edit');

  if (!panel) return;

  // Create resize handle at top of info panel
  const handle = createElement('div', {
    className: 'info-resize-handle',
    style: 'position:absolute;top:-4px;left:0;right:0;height:8px;cursor:ns-resize;z-index:5;'
  });
  panel.style.position = 'relative';
  panel.insertBefore(handle, panel.firstChild);

  // Resize logic
  let isResizing = false;
  let startY = 0;
  let startH = 0;

  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startY = e.clientY;
    startH = panel.offsetHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const diff = startY - e.clientY; // drag up = expand
    const newH = Math.max(80, Math.min(400, startH + diff));
    panel.style.maxHeight = newH + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  // Also allow double-click on handle to toggle expand/collapse
  handle.addEventListener('dblclick', () => {
    if (panel.style.maxHeight === '400px') {
      panel.style.maxHeight = '160px';
    } else {
      panel.style.maxHeight = '400px';
    }
  });

  function showAlgoInfo(id) {
    const algo = registry.get(id);
    if (!algo || !content) return;

    const timeEntries = Object.entries(algo.complexity.time).map(([k, v]) => {
      const label = k === 'best' ? '最好' : k === 'average' ? '平均' : '最坏';
      return `<span class="complexity-item"><span class="complexity-label">${label}:</span><span class="complexity-value">${v}</span></span>`;
    }).join('');

    content.innerHTML = `
      <h3>${algo.name} <span style="color:var(--text-muted);font-weight:400;font-size:0.85rem">${algo.nameEn}</span></h3>
      <div class="complexity">
        ${timeEntries}
        <span class="complexity-item"><span class="complexity-label">空间:</span><span class="complexity-value">${algo.complexity.space}</span></span>
        ${algo.complexity.stable ? `<span class="complexity-item"><span class="complexity-label">稳定性:</span><span class="complexity-value">${algo.complexity.stable}</span></span>` : ''}
      </div>
      <p class="description">${algo.description}</p>
      ${algo.keyPoints?.length ? `
        <div class="key-points">
          <h4>考研要点</h4>
          <ul>${algo.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      ` : ''}
    `;

    panel.classList.add('open');
    panel.style.maxHeight = '160px';
  }

  eventBus.on('algorithm-selected', ({ id }) => showAlgoInfo(id));

  // Data edit button
  dataBtn?.addEventListener('click', () => {
    eventBus.emit('show-data-modal', {});
  });
}
