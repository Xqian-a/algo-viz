import { eventBus } from './event-bus.js';
import { SPEED_MAP } from '../utils/constants.js';

class StepEngine {
  constructor() {
    this.steps = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.speed = 1;
    this._timer = null;
    this._algorithm = null;
    this._data = null;
  }

  load(algorithm, data, extra) {
    this.pause();
    this._algorithm = algorithm;
    this._data = data;
    this._extra = extra;
    this.steps = algorithm.generateSteps(data, extra);
    this.currentIndex = this.steps.length > 0 ? 0 : -1;
    eventBus.emit('steps-loaded', { steps: this.steps, algorithm, currentIndex: this.currentIndex });
    if (this.currentIndex >= 0) {
      eventBus.emit('step-changed', { step: this.steps[this.currentIndex], index: this.currentIndex });
    }
  }

  reload() {
    if (this._algorithm && this._data) {
      this.load(this._algorithm, this._data, this._extra);
    }
  }

  play() {
    if (this.isPlaying || this.steps.length === 0) return;
    this.isPlaying = true;
    eventBus.emit('play-state-changed', { isPlaying: true });
    this._tick();
  }

  pause() {
    this.isPlaying = false;
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    eventBus.emit('play-state-changed', { isPlaying: false });
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  stepForward() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      eventBus.emit('step-changed', { step: this.steps[this.currentIndex], index: this.currentIndex });
    } else {
      this.pause();
      eventBus.emit('complete', {});
    }
  }

  stepBackward() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      eventBus.emit('step-changed', { step: this.steps[this.currentIndex], index: this.currentIndex });
    }
  }

  goToStep(index) {
    const clamped = Math.max(0, Math.min(index, this.steps.length - 1));
    if (clamped !== this.currentIndex) {
      this.currentIndex = clamped;
      eventBus.emit('step-changed', { step: this.steps[this.currentIndex], index: this.currentIndex });
    }
  }

  setSpeed(multiplier) {
    this.speed = multiplier;
    eventBus.emit('speed-changed', { speed: multiplier });
  }

  reset() {
    this.pause();
    this.currentIndex = this.steps.length > 0 ? 0 : -1;
    if (this.currentIndex >= 0) {
      eventBus.emit('step-changed', { step: this.steps[this.currentIndex], index: this.currentIndex });
    }
  }

  getCurrentStep() {
    return this.currentIndex >= 0 ? this.steps[this.currentIndex] : null;
  }

  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.steps.length,
      percent: this.steps.length > 0 ? ((this.currentIndex + 1) / this.steps.length) * 100 : 0,
    };
  }

  _tick() {
    if (!this.isPlaying) return;
    const interval = SPEED_MAP[this.speed] || 800;
    this._timer = setTimeout(() => {
      this.stepForward();
      if (this.isPlaying) this._tick();
    }, interval);
  }
}

export const stepEngine = new StepEngine();
