import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class ArrayRenderer extends BaseRenderer {
  constructor(canvasManager) {
    super(canvasManager);
    this._mode = 'bar'; // 'cell' or 'bar'
  }

  setMode(mode) { this._mode = mode; }

  render(step) {
    super.render(step);
    if (!step || !step.data || !step.data.array) return;
    const arr = step.data.array;
    const highlights = step.highlights || {};
    const pointers = step.pointers || {};

    if (this._mode === 'bar') {
      this._renderBars(arr, highlights, pointers);
    } else {
      this._renderCells(arr, highlights, pointers);
    }
  }

  _renderBars(arr, highlights, pointers) {
    const n = arr.length;
    const maxVal = Math.max(...arr, 1);
    const padding = 60;
    const bottomPadding = 80;
    const topPadding = 50;
    const availableW = this.w - padding * 2;
    const availableH = this.h - bottomPadding - topPadding;
    const gap = Math.max(2, Math.min(6, availableW / n * 0.15));
    const barW = (availableW - gap * (n - 1)) / n;
    const baseY = this.h - bottomPadding;

    for (let i = 0; i < n; i++) {
      const x = padding + i * (barW + gap);
      const barH = (arr[i] / maxVal) * availableH * 0.85;
      const y = baseY - barH;
      const style = this._getBarStyle(i, highlights);
      // Glow effect for active states
      if (highlights.comparing?.includes(i) || highlights.swapping?.includes(i) || highlights.active?.includes(i)) {
        this.ctx.shadowColor = style.stroke;
        this.ctx.shadowBlur = 12;
      }
      this.drawRect(x, y, barW, barH, { ...style, radius: 4 });
      this.ctx.shadowBlur = 0;
      // Value label
      this.drawText(arr[i], x + barW / 2, y - 12, {
        color: style.text || '#e8eaf0',
        font: '600 12px JetBrains Mono, monospace',
      });
      // Index label
      this.drawText(i, x + barW / 2, baseY + 16, {
        color: '#5d6380',
        font: '400 11px JetBrains Mono, monospace',
      });
    }

    // Draw pointers
    this._drawPointers(pointers, padding, barW, gap, baseY);
  }

  _renderCells(arr, highlights, pointers) {
    const n = arr.length;
    const padding = 60;
    const cellSize = Math.min(56, (this.w - padding * 2) / n - 4);
    const totalW = n * (cellSize + 4) - 4;
    const startX = (this.w - totalW) / 2;
    const y = this.h / 2 - 20;

    for (let i = 0; i < n; i++) {
      const x = startX + i * (cellSize + 4);
      const style = this._getBarStyle(i, highlights);
      if (highlights.comparing?.includes(i) || highlights.swapping?.includes(i)) {
        this.ctx.shadowColor = style.stroke;
        this.ctx.shadowBlur = 10;
      }
      this.drawRect(x, y, cellSize, cellSize, { ...style, radius: 6 });
      this.ctx.shadowBlur = 0;
      this.drawText(arr[i], x + cellSize / 2, y + cellSize / 2, {
        color: style.text || '#e8eaf0',
        font: '600 14px JetBrains Mono, monospace',
      });
      this.drawText(i, x + cellSize / 2, y + cellSize + 16, {
        color: '#5d6380',
        font: '400 11px JetBrains Mono, monospace',
      });
    }
    this._drawPointers(pointers, startX, cellSize, 4, y + cellSize + 24);
  }

  _getBarStyle(index, highlights) {
    if (highlights.sorted?.includes(index)) return COLORS.sorted;
    if (highlights.swapping?.includes(index)) return COLORS.swapping;
    if (highlights.comparing?.includes(index)) return COLORS.comparing;
    if (highlights.found?.includes(index)) return COLORS.found;
    if (highlights.active?.includes(index)) return COLORS.active;
    if (highlights.current === index) return COLORS.current;
    return COLORS.default;
  }

  _drawPointers(pointers, startX, itemSize, gap, baseY) {
    if (!pointers || typeof pointers !== 'object') return;
    for (const [name, ptr] of Object.entries(pointers)) {
      if (ptr == null || typeof ptr.position !== 'number') continue;
      const x = startX + ptr.position * (itemSize + gap) + itemSize / 2;
      this.drawPointer(ptr.label || name, x, baseY + 40);
    }
  }
}
