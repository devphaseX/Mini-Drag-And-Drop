import { Listener } from '../model/types.js';

export class State<T> {
  protected listeners: { [type: string]: Listener<T>[] } = {};
  addListener(fn: Listener<T>, type: string) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(fn);
  }
}
