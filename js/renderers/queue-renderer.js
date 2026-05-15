import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class QueueRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.queue) return;
    const queue = step.data.queue;
    const highlights = step.highlights || {};
    const meta = step.data.meta || {};
    const n = queue.length;
    if (n === 0) {
      this.drawText('空队列', this.w / 2, this.h / 2, { color: '#5d6380', font: '400 14px Inter, sans-serif' });
      return;
    }

    const cellW = Math.min(60, (this.w - 100) / n - 6);
    const cellH = 50;
    const totalW = n * (cellW + 6) - 6;
    const startX = (this.w - totalW) / 2;
    const y = this.h / 2 - 20;

    // Container
    this.drawRect(startX - 8, y - 8, totalW + 16, cellH + 16, { fill: 'rgba(78,124,255,0.05)', stroke: 'rgba(78,124,255,0.2)', lineWidth: 1, radius: 6 });

    for (let i = 0; i < n; i++) {
      const x = startX + i * (cellW + 6);
      const style = this._getStyle(i, highlights);
      if (highlights.active?.includes(i)) { this.ctx.shadowColor = style.stroke; this.ctx.shadowBlur = 10; }
      this.drawRect(x, y, cellW, cellH, { ...style, radius: 6 });
      this.ctx.shadowBlur = 0;
      this.drawText(queue[i], x + cellW / 2, y + cellH / 2, { color: style.text, font: '600 14px JetBrains Mono, monospace' });
    }

    // Front/rear pointers
    if (meta.front != null) {
      this.drawPointer('front', startX + (meta.front) * (cellW + 6) + cellW / 2, y + cellH + 28);
    }
    if (meta.rear != null) {
      this.drawPointer('rear', startX + (meta.rear) * (cellW + 6) + cellW / 2, y - 28);
    }

    // Direction labels
    this.drawText('出队 ←', startX - 10, y + cellH / 2, { color: '#5d6380', font: '400 11px Inter, sans-serif', align: 'right' });
    this.drawText('→ 入队', startX + totalW + 10, y + cellH / 2, { color: '#5d6380', font: '400 11px Inter, sans-serif', align: 'left' });
  }

  _getStyle(i, highlights) {
    if (highlights.active?.includes(i)) return COLORS.active;
    if (highlights.found?.includes(i)) return COLORS.found;
    if (highlights.current === i) return COLORS.current;
    return COLORS.default;
  }
}
