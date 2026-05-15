import { COLORS } from '../utils/constants.js';

export class BaseRenderer {
  constructor(canvasManager) {
    this.cm = canvasManager;
  }

  get ctx() { return this.cm.getContext(); }
  get w() { return this.cm.width; }
  get h() { return this.cm.height; }

  clear() { this.cm.clear(); }

  render(step) {
    this.clear();
  }

  // Drawing primitives
  drawRect(x, y, w, h, style = {}) {
    const ctx = this.ctx;
    const { fill = COLORS.default.fill, stroke = COLORS.default.stroke, lineWidth = 2, radius = 6 } = style;
    ctx.beginPath();
    if (radius > 0) {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }

  drawCircle(x, y, r, style = {}) {
    const ctx = this.ctx;
    const { fill = COLORS.default.fill, stroke = COLORS.default.stroke, lineWidth = 2 } = style;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }

  drawText(text, x, y, style = {}) {
    const ctx = this.ctx;
    const { color = '#e8eaf0', font = '600 14px Inter, sans-serif', align = 'center', baseline = 'middle' } = style;
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y);
  }

  drawArrow(x1, y1, x2, y2, style = {}) {
    const ctx = this.ctx;
    const { color = 'rgba(78,124,255,0.6)', lineWidth = 2, headSize = 8 } = style;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headSize * Math.cos(angle - 0.4), y2 - headSize * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - headSize * Math.cos(angle + 0.4), y2 - headSize * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawLine(x1, y1, x2, y2, style = {}) {
    const ctx = this.ctx;
    const { color = 'rgba(78,124,255,0.4)', lineWidth = 2, dash = [] } = style;
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawPointer(label, x, y, style = {}) {
    const ctx = this.ctx;
    const { color = COLORS.pointer.fill } = style;
    const w = Math.max(24, ctx.measureText(label).width + 12);
    const h = 22;
    const cx = x - w / 2;
    // Triangle tip
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y - h);
    ctx.lineTo(x + 5, y - h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    // Box
    this.drawRect(cx, y - h - 16, w, 16, { fill: color, stroke: null, radius: 4 });
    this.drawText(label, x, y - h - 8, { color: '#fff', font: '600 11px JetBrains Mono, monospace' });
  }

  getColorForState(state) {
    return COLORS[state] || COLORS.default;
  }
}
