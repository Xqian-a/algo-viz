import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class StringRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.text) return;
    const text = step.data.text || '';
    const pattern = step.data.pattern || '';
    const highlights = step.highlights || {};
    const pointers = step.pointers || {};
    const nextArr = step.data.nextArr;

    const cellW = Math.min(40, (this.w - 80) / Math.max(text.length, 1));
    const cellH = 40;
    const startX = (this.w - text.length * cellW) / 2;
    const textY = this.h * 0.3;
    const patternY = textY + cellH + 30;
    const offset = step.data.offset || 0;

    // Text string label
    this.drawText('主串 S:', startX - 55, textY + cellH / 2, { color: '#5d6380', font: '500 12px Inter, sans-serif', align: 'right' });
    for (let i = 0; i < text.length; i++) {
      const x = startX + i * cellW;
      const style = this._getTextStyle(i, highlights);
      this.drawRect(x, textY, cellW - 2, cellH, { ...style, radius: 4 });
      this.drawText(text[i], x + (cellW - 2) / 2, textY + cellH / 2, { color: style.text, font: '600 14px JetBrains Mono, monospace' });
      // Index
      this.drawText(i, x + (cellW - 2) / 2, textY - 12, { color: '#5d6380', font: '400 10px JetBrains Mono, monospace' });
    }

    // Pattern string
    if (pattern) {
      this.drawText('模式串 P:', startX + offset * cellW - 55, patternY + cellH / 2, { color: '#5d6380', font: '500 12px Inter, sans-serif', align: 'right' });
      for (let j = 0; j < pattern.length; j++) {
        const idx = offset + j;
        if (idx >= text.length) break;
        const x = startX + idx * cellW;
        const style = this._getPatternStyle(j, highlights);
        this.drawRect(x, patternY, cellW - 2, cellH, { ...style, radius: 4 });
        this.drawText(pattern[j], x + (cellW - 2) / 2, patternY + cellH / 2, { color: style.text, font: '600 14px JetBrains Mono, monospace' });
      }
      // Pattern index
      for (let j = 0; j < pattern.length; j++) {
        const x = startX + (offset + j) * cellW;
        this.drawText(j, x + (cellW - 2) / 2, patternY + cellH + 14, { color: '#5d6380', font: '400 10px JetBrains Mono, monospace' });
      }
    }

    // Pointers i, j
    if (pointers.i?.position != null) {
      const x = startX + pointers.i.position * cellW + (cellW - 2) / 2;
      this.drawPointer('i', x, textY + cellH + 10);
    }
    if (pointers.j?.position != null) {
      const x = startX + (offset + pointers.j.position) * cellW + (cellW - 2) / 2;
      this.drawPointer('j', x, patternY + cellH + 30);
    }

    // next[] array
    if (nextArr) {
      const nextY = patternY + cellH + 70;
      this.drawText('next[]:', startX - 55, nextY + 14, { color: '#9b7dff', font: '500 12px JetBrains Mono, monospace', align: 'right' });
      for (let i = 0; i < nextArr.length; i++) {
        const x = startX + (offset + i) * cellW;
        this.drawRect(x, nextY, cellW - 2, 28, { fill: 'rgba(155,125,255,0.15)', stroke: 'rgba(155,125,255,0.4)', radius: 3 });
        this.drawText(String(nextArr[i]), x + (cellW - 2) / 2, nextY + 14, { color: '#9b7dff', font: '500 12px JetBrains Mono, monospace' });
      }
    }
  }

  _getTextStyle(i, highlights) {
    if (highlights.matched?.includes(i)) return COLORS.sorted;
    if (highlights.mismatch?.includes(i)) return COLORS.swapping;
    if (highlights.comparing?.includes(i)) return COLORS.comparing;
    if (highlights.active?.includes(i)) return COLORS.active;
    return COLORS.default;
  }

  _getPatternStyle(j, highlights) {
    if (highlights.patternMatched?.includes(j)) return COLORS.sorted;
    if (highlights.patternMismatch?.includes(j)) return COLORS.swapping;
    if (highlights.comparing?.includes(j + (highlights.offset || 0))) return COLORS.comparing;
    return { fill: 'rgba(155,125,255,0.4)', stroke: 'rgba(155,125,255,0.7)', text: '#e8eaf0' };
  }
}
