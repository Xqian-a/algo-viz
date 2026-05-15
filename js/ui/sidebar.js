import { $, $$, createElement } from '../utils/dom.js';
import { registry } from '../core/registry.js';
import { eventBus } from '../core/event-bus.js';

export function initSidebar() {
  const nav = $('#sidebar-nav');
  const searchInput = $('#search-input');
  renderChapters(nav);

  // Search
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (q) {
      const results = registry.search(q);
      renderSearchResults(nav, results);
    } else {
      renderChapters(nav);
    }
  });

  // Upload button in sidebar
  const uploadDiv = createElement('div', { className: 'sidebar-upload', id: 'sidebar-upload-btn' }, []);
  uploadDiv.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> 上传自定义代码`;
  uploadDiv.addEventListener('click', () => eventBus.emit('show-upload-modal', {}));
  nav.parentElement.appendChild(uploadDiv);
}

function renderChapters(nav) {
  nav.innerHTML = '';
  const chapters = registry.getAllChapters();
  for (const ch of chapters) {
    const group = createElement('div', { className: 'chapter-group expanded' });
    const header = createElement('div', { className: 'chapter-header' });
    header.innerHTML = `<span class="chapter-arrow">▶</span><span class="chapter-icon">${ch.icon}</span><span class="chapter-name">${ch.name}</span><span class="chapter-count">${ch.algorithms.length}</span>`;
    header.addEventListener('click', () => group.classList.toggle('expanded'));
    group.appendChild(header);

    const items = createElement('div', { className: 'chapter-items' });
    for (const algo of ch.algorithms) {
      const item = createElement('div', { className: 'algo-item', dataset: { id: algo.id } });
      item.innerHTML = `<span class="algo-name-zh">${algo.name}</span><span class="algo-name-en">${algo.nameEn}</span>`;
      item.addEventListener('click', () => {
        $$('.algo-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        eventBus.emit('algorithm-selected', { id: algo.id });
      });
      items.appendChild(item);
    }
    group.appendChild(items);
    nav.appendChild(group);
  }
}

function renderSearchResults(nav, results) {
  nav.innerHTML = '';
  if (results.length === 0) {
    nav.innerHTML = '<div style="padding:16px;color:var(--text-muted);text-align:center;">未找到匹配的算法</div>';
    return;
  }
  const group = createElement('div', { className: 'chapter-group expanded' });
  const header = createElement('div', { className: 'chapter-header' });
  header.innerHTML = `<span class="chapter-arrow">▶</span><span class="chapter-icon">🔍</span><span class="chapter-name">搜索结果 (${results.length})</span>`;
  group.appendChild(header);
  const items = createElement('div', { className: 'chapter-items', style: { display: 'block' } });
  for (const algo of results) {
    const item = createElement('div', { className: 'algo-item', dataset: { id: algo.id } });
    item.innerHTML = `<span class="algo-name-zh">${algo.name}</span><span class="algo-name-en">${algo.nameEn}</span>`;
    item.addEventListener('click', () => {
      $$('.algo-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      eventBus.emit('algorithm-selected', { id: algo.id });
    });
    items.appendChild(item);
  }
  group.appendChild(items);
  nav.appendChild(group);
}
