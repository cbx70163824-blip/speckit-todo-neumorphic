import { subscribe, getState } from './store.js';
import { render } from './render.js';
import { registerEvents } from './events.js';

function init() {
  registerEvents();
  render(getState());
  subscribe(render);
}

init();
