# 从零构建一个考研数据结构算法可视化网站

> 一个支持 31 种算法、单步调试、C++ 代码高亮的纯前端可视化工具。

---

## 缘起

备考计算机考研的学生都知道，**数据结构** 这门课最大的痛点在于：算法看了好几遍，代码也能背下来，但一到动手模拟执行过程就卡壳。

冒泡排序每一轮发生了什么？KMP 算法的 next 数组是怎么一步步算出来的？Dijkstra 最短路径中 dist 数组如何更新？这些问题光看教材很难建立直观印象。

于是我花了几天时间，从零搭建了一个 **算法可视化网站**，覆盖考研数据结构全部 7 个章节、31 个核心算法，支持单步执行和连续播放，希望能帮到同样在备考的同学。

## 技术选型

项目只有一个硬性约束：**不能依赖 Node.js 构建工具**，最终产物要能做到"双击 index.html 就能用"。

基于这个前提，技术栈变得非常纯粹：

```
纯 HTML + CSS + JS
├── Canvas2D     → 所有可视化渲染
├── ES Modules   → 模块化开发
├── Prism.js     → C++ 代码语法高亮（CDN）
└── Python       → 构建脚本，打包成单文件
```

没有 React/Vue，没有 Webpack/Vite。所有模块用浏览器原生的 `import/export` 组织，开发时用 `python -m http.server` 起个本地服务器即可。

发布阶段，一个 200 行的 Python 脚本把所有 CSS 和 JS 内联到一个 HTML 文件里，丢到 `docs/` 目录直接上 GitHub Pages。

## 架构设计

整个应用分为三层：

```
┌──────────────────────────────────────┐
│  UI Layer（侧边栏、代码面板、控制栏）  │
├──────────────────────────────────────┤
│  Step Engine（步骤生成 → 播放控制）    │
├──────────────────────────────────────┤
│  Canvas Renderers（8 种数据结构渲染器）│
└──────────────────────────────────────┘
```

### 核心思路：预生成步骤快照

这是整个项目最重要的设计决策。

我们**不去真正"执行" C++ 代码**。而是在 JavaScript 中模拟算法的运行过程，在每一个有意义的时刻（比较、交换、访问、递归进入等）记录下完整的状态快照：

```javascript
// 每一步都是一个 Step 对象
{
  line: 5,                    // 当前 C++ 代码行号
  phase: "比较",               // 阶段标签
  description: "比较 arr[2]=25 和 arr[3]=12",  // 中文描述
  data: { array: [64, 34, 25, 12, ...] },     // 数据状态
  highlights: { comparing: [2, 3], sorted: [] }, // 高亮标记
  pointers: { i: { position: 0 }, j: { position: 2 } }  // 指针位置
}
```

这样做的好处是：
- **完全可控**：每一步都精确描述了该渲染什么
- **可以前进/后退**：步进引擎只是在一个数组中移动索引
- **不依赖编译器**：不需要在浏览器里跑 C++ 代码

### 渲染器体系

针对不同的数据结构，我实现了 8 种 Canvas2D 渲染器：

| 渲染器 | 适用算法数 | 渲染内容 |
|--------|:---:|------|
| ArrayRenderer | 12 | 柱状图 / 单元格，支持指针标注 |
| TreeRenderer | 7 | 二叉树布局，节点高亮，遍历路径 |
| GraphRenderer | 6 | 圆形布局，边权重，邻接矩阵 |
| LinkedListRenderer | 1 | 结点框 + 箭头 + NULL 标记 |
| StackRenderer | 1 | 垂直堆叠，top 指针 |
| QueueRenderer | 2 | 水平排列，front/rear 指针 |
| StringRenderer | 1 | 字符格对齐，next 数组显示 |
| HashRenderer | 1 | 表格布局，冲突链 |

每种渲染器都继承自 `BaseRenderer`，提供统一的绘图原语（圆角矩形、圆形、箭头、标签）。

### 算法注册机制

新增算法极其简单——只需导出一个包含元数据和 `generateSteps()` 函数的对象即可自动注册：

```javascript
const entry = {
  id: 'ch7-bubble-sort',
  name: '冒泡排序',
  chapter: 'ch7-sort',
  sourceCode: `void bubbleSort(int arr[], int n) { ... }`,
  generateSteps(arr) {
    // 在 JS 中模拟算法，逐步推送 Step 对象
    const steps = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        steps.push({ /* 比较步骤 */ });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({ /* 交换步骤 */ });
        }
      }
    }
    return steps;
  }
};
registry.register(entry);
```

侧边栏自动从注册表中读取所有算法并按章节分组，无需手动维护列表。

## 踩坑记录

### 1. 打包后点击无响应

排查了很久才发现——两个 modal overlay 元素用了 `position: fixed; inset: 0`，虽然设置了 `opacity: 0` 和 `pointer-events: none`，但在某些浏览器中 `backdrop-filter: blur()` 依然会创建渲染层拦截点击。

**解决**：给隐藏态的 overlay 加上 `visibility: hidden`，只在 `.open` 时设为 `visible`。

### 2. 堆排序动画"越排元素越少"

堆排序的树形可视化中，排序过程中 heapSize 逐渐缩小，我是先缩减树节点数量，结果已排好的元素从树上直接消失了。

**解决**：始终渲染全部 n 个节点，用绿色标记已排好的节点，堆范围内的节点正常显示，这样排序过程中树始终是完整的。

### 3. 算法切换卡顿 2-3 秒

原始代码中每次切换算法时，Prism.js 的语法高亮、Canvas 渲染、信息面板更新全部同步执行，累积造成了可感知的延迟。

**解决**：采用分层优化——步骤生成和 Canvas 渲染保持同步（足够快），将 Prism 高亮推迟到 `requestAnimationFrame`，并加入防重复初始化保护。

### 4. GitHub Pages 只支持根目录和 /docs

`build.py` 原本输出到 `dist/`，但 GitHub Pages 的 source path 只接受 `/` 或 `/docs`。

**解决**：将输出目录从 `dist` 改为 `docs`，一行改动即可。

## 总结

这个项目本身不大（76 个文件，约 11000 行代码），但麻雀虽小五脏俱全。从架构设计到性能优化，踩了不少前端开发的经典坑。

如果你也在备考考研，希望这个工具能帮到你。如果你对实现细节感兴趣，欢迎去 [GitHub 仓库](https://github.com/Xqian-a/algo-viz) 看源码。

---

**在线地址**：[xqian-a.github.io/algo-viz](https://xqian-a.github.io/algo-viz/)

**GitHub**：[github.com/Xqian-a/algo-viz](https://github.com/Xqian-a/algo-viz)
