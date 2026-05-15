import { $, $$ } from '../utils/dom.js';
import { eventBus } from '../core/event-bus.js';
import { stepEngine } from '../core/step-engine.js';

export function initControlBar() {
  const btnFirst = $('#btn-first');
  const btnPrev = $('#btn-prev');
  const btnPlay = $('#btn-play');
  const btnNext = $('#btn-next');
  const btnLast = $('#btn-last');
  const progressSlider = $('#progress-slider');
  const speedBtns = $$('.btn-speed');

  function updateButtons() {
    const hasSteps = stepEngine.steps.length > 0;
    const idx = stepEngine.currentIndex;
    const total = stepEngine.steps.length;
    [btnFirst, btnPrev, btnPlay, btnNext, btnLast].forEach(b => b.disabled = !hasSteps);
    if (btnFirst) btnFirst.disabled = !hasSteps || idx <= 0;
    if (btnPrev) btnPrev.disabled = !hasSteps || idx <= 0;
    if (btnNext) btnNext.disabled = !hasSteps || idx >= total - 1;
    if (btnLast) btnLast.disabled = !hasSteps || idx >= total - 1;
  }

  function updateProgress() {
    const { current, total, percent } = stepEngine.getProgress();
    const fill = $('#progress-fill');
    const text = $('#progress-text');
    const slider = $('#progress-slider');
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${current} / ${total}`;
    if (slider) { slider.max = total - 1; slider.value = current - 1; }
  }

  function updatePlayBtn() {
    const iconPlay = btnPlay?.querySelector('.icon-play');
    const iconPause = btnPlay?.querySelector('.icon-pause');
    if (iconPlay) iconPlay.style.display = stepEngine.isPlaying ? 'none' : '';
    if (iconPause) iconPause.style.display = stepEngine.isPlaying ? '' : 'none';
  }

  btnPlay?.addEventListener('click', () => stepEngine.togglePlay());
  btnFirst?.addEventListener('click', () => stepEngine.reset());
  btnPrev?.addEventListener('click', () => { stepEngine.pause(); stepEngine.stepBackward(); });
  btnNext?.addEventListener('click', () => { stepEngine.pause(); stepEngine.stepForward(); });
  btnLast?.addEventListener('click', () => { stepEngine.pause(); stepEngine.goToStep(stepEngine.steps.length - 1); });

  progressSlider?.addEventListener('input', (e) => {
    stepEngine.pause();
    stepEngine.goToStep(parseInt(e.target.value));
  });

  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      stepEngine.setSpeed(parseFloat(btn.dataset.speed));
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case ' ': e.preventDefault(); stepEngine.togglePlay(); break;
      case 'ArrowLeft': e.preventDefault(); stepEngine.pause(); stepEngine.stepBackward(); break;
      case 'ArrowRight': e.preventDefault(); stepEngine.pause(); stepEngine.stepForward(); break;
      case 'Home': e.preventDefault(); stepEngine.reset(); break;
      case 'End': e.preventDefault(); stepEngine.pause(); stepEngine.goToStep(stepEngine.steps.length - 1); break;
    }
  });

  // Listen for events
  eventBus.on('steps-loaded', () => { updateButtons(); updateProgress(); });
  eventBus.on('step-changed', () => { updateButtons(); updateProgress(); });
  eventBus.on('play-state-changed', () => { updatePlayBtn(); updateButtons(); });
  eventBus.on('complete', () => { updateButtons(); updatePlayBtn(); });

  // Initial state
  updateButtons();
  updateProgress();
  updatePlayBtn();
}
