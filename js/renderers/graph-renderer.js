import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class GraphRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.graph) return;
    const graph = step.data.graph;
    const highlights = step.highlights || {};
    const nodes = graph.nodes || [];
    const edges = graph.edges || [];
    if (nodes.length === 0) return;

    const nodeR = Math.min(26, Math.max(18, Math.min(this.w, this.h) / (nodes.length * 2.5)));

    // Calculate positions (circular layout for small graphs)
    const positions = {};
    const cx = this.w / 2, cy = this.h / 2;
    const radius = Math.min(cx, cy) * 0.65;

    if (graph.positions) {
      for (const n of nodes) {
        if (graph.positions[n.id]) positions[n.id] = graph.positions[n.id];
      }
    } else {
      const angleStep = (2 * Math.PI) / nodes.length;
      nodes.forEach((n, i) => {
        positions[n.id] = {
          x: cx + radius * Math.cos(angleStep * i - Math.PI / 2),
          y: cy + radius * Math.sin(angleStep * i - Math.PI / 2)
        };
      });
    }

    // Draw edges
    for (const edge of edges) {
      const from = positions[edge.from], to = positions[edge.to];
      if (!from || !to) continue;
      const isHighlighted = highlights.edges?.some(e => (e[0] === edge.from && e[1] === edge.to) || (e[0] === edge.to && e[1] === edge.from));
      const edgeColor = isHighlighted ? 'rgba(248,113,113,0.8)' : 'rgba(78,124,255,0.3)';
      const lineW = isHighlighted ? 3 : 1.5;

      // Direction for directed graph
      const dx = to.x - from.x, dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / dist, uy = dy / dist;
      const startX = from.x + ux * nodeR, startY = from.y + uy * nodeR;
      const endX = to.x - ux * nodeR, endY = to.y - uy * nodeR;

      if (graph.directed) {
        this.drawArrow(startX, startY, endX, endY, { color: edgeColor, lineWidth: lineW });
      } else {
        this.drawLine(startX, startY, endX, endY, { color: edgeColor, lineWidth: lineW });
      }

      // Edge weight
      if (edge.weight !== undefined) {
        const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
        const offsetX = -uy * 12, offsetY = ux * 12;
        this.drawRect(mx + offsetX - 12, my + offsetY - 9, 24, 18, { fill: 'rgba(15,17,23,0.9)', stroke: 'rgba(78,124,255,0.3)', radius: 4 });
        this.drawText(String(edge.weight), mx + offsetX, my + offsetY, { color: '#fbbf24', font: '600 11px JetBrains Mono, monospace' });
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const pos = positions[node.id];
      if (!pos) continue;
      const style = this._getNodeStyle(node.id, highlights);
      if (highlights.current === node.id || highlights.active?.includes(node.id)) {
        this.ctx.shadowColor = style.stroke; this.ctx.shadowBlur = 15;
      }
      this.drawCircle(pos.x, pos.y, nodeR, { ...style, lineWidth: 2.5 });
      this.ctx.shadowBlur = 0;
      this.drawText(node.label || String(node.id), pos.x, pos.y, { color: style.text, font: '600 13px JetBrains Mono, monospace' });
    }

    // Adjacency matrix (if available and space permits)
    if (graph.adjMatrix && this.w > 500 && this.h > 300) {
      this._drawAdjMatrix(graph.adjMatrix, nodes);
    }
  }

  _drawAdjMatrix(matrix, nodes) {
    const cellSize = Math.min(18, 100 / nodes.length);
    const startX = 12, startY = this.h - (nodes.length + 1) * cellSize - 10;
    this.drawText('邻接矩阵:', startX, startY - 6, { color: '#5d6380', font: '400 10px Inter, sans-serif', align: 'left' });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        const val = matrix[i]?.[j] ?? 0;
        const x = startX + (j + 1) * cellSize;
        const y = startY + i * cellSize;
        this.drawText(String(val), x + cellSize / 2, y + cellSize / 2, { color: val ? '#4e7cff' : '#3d4060', font: '400 10px JetBrains Mono, monospace' });
      }
    }
  }

  _getNodeStyle(id, highlights) {
    if (highlights.found?.includes(id)) return COLORS.found;
    if (highlights.active?.includes(id)) return COLORS.active;
    if (highlights.current === id) return COLORS.current;
    if (highlights.visited?.includes(id)) return COLORS.visited;
    if (highlights.sorted?.includes(id)) return COLORS.sorted;
    return COLORS.default;
  }
}
