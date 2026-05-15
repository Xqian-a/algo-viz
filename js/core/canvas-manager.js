class CanvasManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    this._resizeObserver = null;
    this._onResize = null;
  }

  init(canvas, onResize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._onResize = onResize;
    this._setupResize();
    this._resize();
  }

  _setupResize() {
    const container = this.canvas.parentElement;
    this._resizeObserver = new ResizeObserver(() => this._resize());
    this._resizeObserver.observe(container);
  }

  _resize() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this._onResize) this._onResize(this.width, this.height);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  getContext() { return this.ctx; }
  getSize() { return { width: this.width, height: this.height }; }
}

export const canvasManager = new CanvasManager();
