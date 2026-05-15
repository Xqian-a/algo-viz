import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class HashRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.table) return;
    const table = step.data.table;
    const highlights = step.highlights || {};
    const meta = step.data.meta || {};
    const size = table.length;
    if (size === 0) return;

    const cellW = Math.min(60, (this.w - 100) / Math.min(size, 16));
    const cellH = 40;
    const cols = Math.min(size, Math.floor((this.w - 60) / (cellW + 4)));
    const rows = Math.ceil(size / cols);
    const totalGridW = cols * (cellW + 4) - 4;
    const startX = (this.w - totalGridW) / 2;
    const startY = this.h / 2 - (rows * (cellH + 4)) / 2;

    // Hash function display
    if (meta.hashFunc) {
      this.drawText(`H(key) = ${meta.hashFunc}`, this.w / 2, 30, { color: '#9b7dff', font: '500 13px JetBrains Mono, monospace' });
    }

    // Draw table slots
    for (let i = 0; i < size; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cellW + 4);
      const y = startY + row * (cellH + 4);
      const entry = table[i];
      const style = this._getStyle(i, highlights);

      this.drawRect(x, y, cellW, cellH, { ...style, radius: 4 });
      // Index
      this.drawText(i, x + cellW / 2, y - 8, { color: '#5d6380', font: '400 10px JetBrains Mono, monospace' });
      // Value
      if (entry != null && entry !== undefined) {
        this.drawText(String(entry), x + cellW / 2, y + cellH / 2, { color: style.text, font: '600 13px JetBrains Mono, monospace' });
      } else {
        this.drawText('—', x + cellW / 2, y + cellH / 2, { color: '#3d4060', font: '400 13px JetBrains Mono, monospace' });
      }
    }

    // Collision chain visualization
    if (meta.chains) {
      for (const [slotIdx, chain] of Object.entries(meta.chains)) {
        const col = Number(slotIdx) % cols;
        const row = Math.floor(Number(slotIdx) / cols);
        const x = startX + col * (cellW + 4) + cellW;
        const y = startY + row * (cellH + 4) + cellH / 2;
        for (let ci = 0; ci < chain.length; ci++) {
          const cx = x + 10 + ci * 50;
          this.drawArrow(x + ci * 50, y, cx, y, { color: 'rgba(251,191,36,0.5)' });
          this.drawRect(cx, y - 14, 40, 28, { fill: 'rgba(251,191,36,0.2)', stroke: 'rgba(251,191,36,0.5)', radius: 4 });
          this.drawText(String(chain[ci]), cx + 20, y, { color: '#fbbf24', font: '500 12px JetBrains Mono, monospace' });
        }
      }
    }
  }

  _getStyle(i, highlights) {
    if (highlights.active?.includes(i)) return COLORS.active;
    if (highlights.comparing?.includes(i)) return COLORS.comparing;
    if (highlights.found?.includes(i)) return COLORS.found;
    if (highlights.current === i) return COLORS.current;
    return { fill: 'rgba(78,124,255,0.2)', stroke: 'rgba(78,124,255,0.4)', text: '#e8eaf0' };
  }
}
