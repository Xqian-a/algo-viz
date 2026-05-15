class StateStore {
  constructor() {
    this.currentAlgorithmId = null;
    this.currentAlgorithm = null;
    this.currentData = null;
    this.isCodePanelOpen = true;
  }

  setAlgorithm(algo, data) {
    this.currentAlgorithm = algo;
    this.currentAlgorithmId = algo ? algo.id : null;
    this.currentData = data;
  }

  setData(data) {
    this.currentData = data;
  }
}

export const state = new StateStore();
