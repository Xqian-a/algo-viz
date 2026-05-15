import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class LinkedListRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.nodes) return;
    const { nodes } = step.data;
    const highlights = step.highlights || {};
    const pointers = step.pointers || {};
    const n = nodes.length;
    if (n === 0) return;

    const nodeW = 90, nodeH = 44, gap = 50;
    const totalW = n * (nodeW + gap) - gap;
    const startX = Math.max(20, (this.w - totalW) / 2);
    const y = this.h / 2 - 10;

    for (let i = 0; i < n; i++) {
      const x = startX + i * (nodeW + gap);
      const node = nodes[i];
      const style = this._getNodeStyle(i, highlights);
      if (highlights.comparing?.includes(i) || highlights.active?.includes(i)) {
        this.ctx.shadowColor = style.stroke; this.ctx.shadowBlur = 12;
      }
      // Node box
      this.drawRect(x, y, nodeW * 0.6, nodeH, { ...style, radius: 8 });
      this.ctx.shadowBlur = 0;
      // Pointer section
      this.drawRect(x + nodeW * 0.6, y, nodeW * 0.4, nodeH, { fill: 'rgba(78,124,255,0.2)', stroke: style.stroke, radius: 8 });
      // Value
      this.drawText(node.value, x + nodeW * 0.3, y + nodeH / 2, { color: style.text, font: '600 14px JetBrains Mono, monospace' });
      // Arrow to next
      if (i < n - 1) {
        this.drawArrow(x + nodeW, y + nodeH / 2, x + nodeW + gap - 4, y + nodeH / 2, { color: 'rgba(78,124,255,0.5)', lineWidth: 2 });
      } else {
        // Null indicator
        this.drawText('∅', x + nodeW + 20, y + nodeH / 2, { color: '#5d6380', font: '400 14px JetBrains Mono, monospace' });
      }
    }

    // Draw pointers
    for (const [name, ptr] of Object.entries(pointers)) {
      if (ptr?.position != null && ptr.position < n) {
        const x = startX + ptr.position * (nodeW + gap) + nodeW / 2;
        this.drawPointer(ptr.label || name, x, y + nodeH + 30);
      }
    }

    // Head/Tail labels
    if (n > 0) {
      this.drawText('HEAD', startX + nodeW / 2, y - 30, { color: '#5d6380', font: '500 11px Inter, sans-serif' });
      this.drawArrow(startX + nodeW / 2, y - 22, startX + nodeW / 2, y - 4, { color: '#5d6380' });
    }
  }

  _getNodeStyle(index, highlights) {
    if (highlights.swapping?.includes(index)) return COLORS.swapping;
    if (highlights.found?.includes(index)) return COLORS.found;
    if (highlights.active?.includes(index)) return COLORS.active;
    if (highlights.comparing?.includes(index)) return COLORS.comparing;
    if (highlights.visited?.includes(index)) return COLORS.visited;
    if (highlights.sorted?.includes(index)) return COLORS.sorted;
    if (highlights.current === index) return COLORS.current;
    return COLORS.default;
  }
}
