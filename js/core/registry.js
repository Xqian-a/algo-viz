import { CHAPTERS } from '../utils/constants.js';

class Registry {
  constructor() {
    this._algorithms = new Map();
    this._chapters = new Map();
    for (const ch of CHAPTERS) {
      this._chapters.set(ch.id, { ...ch, algorithms: [] });
    }
  }

  register(entry) {
    this._algorithms.set(entry.id, entry);
    const ch = this._chapters.get(entry.chapter);
    if (ch) ch.algorithms.push(entry);
  }

  get(id) { return this._algorithms.get(id); }

  getByChapter(chapterId) {
    const ch = this._chapters.get(chapterId);
    return ch ? ch.algorithms : [];
  }

  getAllChapters() {
    return [...this._chapters.values()].filter(ch => ch.algorithms.length > 0);
  }

  getAll() { return [...this._algorithms.values()]; }

  search(query) {
    const q = query.toLowerCase();
    return this.getAll().filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.nameEn.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  }
}

export const registry = new Registry();
