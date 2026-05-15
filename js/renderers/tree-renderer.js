import { BaseRenderer } from './base-renderer.js';
import { COLORS } from '../utils/constants.js';

export class TreeRenderer extends BaseRenderer {
  render(step) {
    super.render(step);
    if (!step?.data?.tree) return;
    const tree = step.data.tree;
    const highlights = step.highlights || {};
    const nodes = tree.nodes || [];
    if (nodes.length === 0) return;

    // Calculate positions using level-order layout
    const positions = this._layoutTree(tree);
    const nodeR = Math.min(24, Math.max(16, this.w / (nodes.length * 3)));
    const edgeColor = 'rgba(78,124,255,0.3)';

    // Draw edges first
    for (const node of nodes) {
      const pos = positions[node.id];
      if (!pos) continue;
      if (node.left && positions[node.left]) {
        const childPos = positions[node.left];
        this.drawLine(pos.x, pos.y + nodeR, childPos.x, childPos.y - nodeR, { color: edgeColor, lineWidth: 2 });
      }
      if (node.right && positions[node.right]) {
        const childPos = positions[node.right];
        this.drawLine(pos.x, pos.y + nodeR, childPos.x, childPos.y - nodeR, { color: edgeColor, lineWidth: 2 });
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
      this.drawText(String(node.value), pos.x, pos.y, { color: style.text, font: '600 13px JetBrains Mono, monospace' });
      // Balance factor for AVL
      if (node.bf !== undefined) {
        this.drawText(`bf=${node.bf}`, pos.x + nodeR + 14, pos.y - nodeR, { color: '#5d6380', font: '400 10px JetBrains Mono, monospace', align: 'left' });
      }
    }

    // Draw edge labels (Huffman)
    if (tree.edgeLabels) {
      for (const [parentId, childId, label] of tree.edgeLabels) {
        const pp = positions[parentId], cp = positions[childId];
        if (pp && cp) {
          this.drawText(label, (pp.x + cp.x) / 2 - 10, (pp.y + cp.y) / 2, { color: '#fbbf24', font: '600 12px JetBrains Mono, monospace' });
        }
      }
    }

    // Traversal info
    if (step.data.traversal) {
      const tx = 20, ty = 30;
      this.drawText(step.data.traversal, tx, ty, { color: '#9ca3b8', font: '400 12px JetBrains Mono, monospace', align: 'left' });
    }
  }

  _layoutTree(tree) {
    const positions = {};
    const nodes = tree.nodes || [];
    const nodeMap = {};
    for (const n of nodes) nodeMap[n.id] = n;

    const levelWidth = {};
    const levelCount = {};

    function getLevel(id, level = 0) {
      if (!id || !nodeMap[id]) return;
      levelWidth[level] = (levelWidth[level] || 0) + 1;
      levelCount[level] = (levelCount[level] || 0);
      getLevel(nodeMap[id]?.left, level + 1);
      getLevel(nodeMap[id]?.right, level + 1);
    }

    const root = tree.root;
    if (!root) return positions;

    // BFS layout
    const queue = [{ id: root, level: 0, order: 0 }];
    const levelItems = {};
    while (queue.length > 0) {
      const { id, level, order } = queue.shift();
      if (!id || !nodeMap[id]) continue;
      if (!levelItems[level]) levelItems[level] = [];
      levelItems[level].push({ id, order });
      const node = nodeMap[id];
      queue.push({ id: node.left, level: level + 1, order: order * 2 });
      queue.push({ id: node.right, level: level + 1, order: order * 2 + 1 });
    }

    const maxLevel = Math.max(0, ...Object.keys(levelItems).map(Number));
    const levelH = Math.min(70, (this.h - 80) / (maxLevel + 1));
    const topY = 50;

    for (const [level, items] of Object.entries(levelItems)) {
      const lv = Number(level);
      const y = topY + lv * levelH;
      const count = items.length;
      const spacing = this.w / (count + 1);
      items.forEach((item, idx) => {
        positions[item.id] = { x: spacing * (idx + 1), y };
      });
    }

    return positions;
  }

  _getNodeStyle(id, highlights) {
    if (highlights.swapping?.includes(id)) return COLORS.swapping;
    if (highlights.found?.includes(id)) return COLORS.found;
    if (highlights.active?.includes(id)) return COLORS.active;
    if (highlights.current === id) return COLORS.current;
    if (highlights.visited?.includes(id)) return COLORS.visited;
    if (highlights.sorted?.includes(id)) return COLORS.sorted;
    return COLORS.default;
  }
}
