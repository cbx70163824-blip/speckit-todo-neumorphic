const STORAGE_KEY = 'neumorphic-todo:state';
const SCHEMA_VERSION = 'v1';

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const defaultData = Object.freeze({
  schemaVersion: SCHEMA_VERSION,
  todos: [],
  filter: 'all'
});

let data = loadPersistedState();
let editingId = null;
const subscribers = new Set();

function loadPersistedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return deepClone(defaultData);
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.todos)) {
      return deepClone(defaultData);
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      todos: parsed.todos.map((todo) => ({ ...todo })),
      filter: parsed.filter ?? 'all'
    };
  } catch (error) {
    console.warn('Unable to load todos; starting fresh.', error);
    return deepClone(defaultData);
  }
}

function persistState(next) {
  try {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      todos: next.todos.map((todo) => ({ id: todo.id, text: todo.text, completed: !!todo.completed })),
      filter: next.filter
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Unable to save todos; continuing in-memory.', error);
  }
}

function notify() {
  const snapshot = getState();
  subscribers.forEach((fn) => fn(snapshot));
}

export function subscribe(callback) {
  subscribers.add(callback);
  callback(getState());
  return () => subscribers.delete(callback);
}

export function getState() {
  return {
    ...data,
    todos: data.todos.map((todo) => ({ ...todo })),
    editingId
  };
}

function setData(updater) {
  const next = typeof updater === 'function' ? updater(data) : updater;
  data = {
    schemaVersion: SCHEMA_VERSION,
    todos: next.todos.map((todo) => ({ ...todo })),
    filter: next.filter ?? data.filter
  };
  persistState(data);
  notify();
}

export function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  setData((current) => ({
    ...current,
    todos: [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: trimmed,
        completed: false
      },
      ...current.todos
    ]
  }));
  announce(`${trimmed} added`);
}

export function toggleTodo(id) {
  setData((current) => ({
    ...current,
    todos: current.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }));
}

export function deleteTodo(id) {
  const target = data.todos.find((todo) => todo.id === id);
  setData((current) => ({
    ...current,
    todos: current.todos.filter((todo) => todo.id !== id)
  }));
  if (target) {
    announce(`${target.text} removed`);
  }
}

export function setFilter(nextFilter) {
  if (!['all', 'active', 'completed'].includes(nextFilter)) return;
  setData((current) => ({ ...current, filter: nextFilter }));
  announce(`${capitalize(nextFilter)} filter active`);
}

export function clearCompleted() {
  const completedCount = data.todos.filter((todo) => todo.completed).length;
  if (!completedCount) return;
  setData((current) => ({
    ...current,
    todos: current.todos.filter((todo) => !todo.completed)
  }));
  announce('Cleared completed todos');
}

export function toggleAll() {
  if (!data.todos.length) return;
  const shouldCompleteAll = data.todos.some((todo) => !todo.completed);
  setData((current) => ({
    ...current,
    todos: current.todos.map((todo) => ({ ...todo, completed: shouldCompleteAll }))
  }));
  announce(shouldCompleteAll ? 'All todos completed' : 'Marked all todos active');
}

export function setEditing(id) {
  editingId = id;
  notify();
}

export function commitEdit(id, nextText) {
  const trimmed = nextText.trim();
  if (!trimmed) {
    cancelEdit();
    return;
  }
  setData((current) => ({
    ...current,
    todos: current.todos.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo))
  }));
  editingId = null;
  notify();
  announce('Todo updated');
}

export function cancelEdit() {
  editingId = null;
  notify();
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const liveRegion = document.getElementById('statusMessage');

function announce(message) {
  if (!liveRegion) return;
  liveRegion.textContent = message;
}
