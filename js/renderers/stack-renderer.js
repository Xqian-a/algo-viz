import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class StackRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.stack) return;
    const stack = step.data.stack;
    const highlights = step.highlights || {};
    const n = stack.length;
    if (n === 0) {
      this.drawText('空栈', this.w / 2, this.h / 2, { color: '#5d6380', font: '400 14px Inter, sans-serif' });
      return;
    }

    const cellW = Math.min(80, this.w * 0.4);
    const cellH = 44;
    const maxVisible = Math.floor((this.h - 120) / (cellH + 6));
    const startY = this.h - 80;
    const cx = this.w / 2;

    // Stack container
    const visibleCount = Math.min(n, maxVisible);
    const containerH = visibleCount * (cellH + 6) + 16;
    this.drawRect(cx - cellW / 2 - 8, startY - containerH, cellW + 16, containerH, { fill: 'rgba(78,124,255,0.05)', stroke: 'rgba(78,124,255,0.2)', lineWidth: 1, radius: 6 });

    for (let i = 0; i < visibleCount; i++) {
      const stackIdx = n - 1 - i;
      const y = startY - (i + 1) * (cellH + 6);
      const style = this._getStyle(stackIdx, highlights);
      if (i === 0) { this.ctx.shadowColor = style.stroke; this.ctx.shadowBlur = 10; }
      this.drawRect(cx - cellW / 2, y, cellW, cellH, { ...style, radius: 6 });
      this.ctx.shadowBlur = 0;
      this.drawText(stack[stackIdx], cx, y + cellH / 2, { color: style.text, font: '600 14px JetBrains Mono, monospace' });
    }

    // Top pointer
    if (n > 0) {
      const topY = startY - cellH - 6;
      this.drawText('← top', cx + cellW / 2 + 30, topY + cellH / 2, { color: '#fbbf24', font: '500 12px JetBrains Mono, monospace', align: 'left' });
    }

    // Bottom label
    this.drawText('栈底', cx, startY + 16, { color: '#5d6380', font: '400 11px Inter, sans-serif' });
  }

  _getStyle(i, highlights) {
    if (highlights.active?.includes(i)) return COLORS.active;
    if (highlights.comparing?.includes(i)) return COLORS.comparing;
    if (highlights.current === i) return COLORS.current;
    return COLORS.default;
  }
}
