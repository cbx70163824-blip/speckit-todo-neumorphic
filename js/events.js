import {
  addTodo,
  toggleTodo,
  deleteTodo,
  setFilter,
  clearCompleted,
  toggleAll,
  setEditing,
  commitEdit,
  cancelEdit
} from './store.js';
import { getRefs } from './render.js';

const refs = getRefs();
const form = document.getElementById('todoForm');
const input = document.getElementById('todo-input');
const statusMessage = document.getElementById('statusMessage');

export function registerEvents() {
  form.addEventListener('submit', handleSubmit);
  refs.list.addEventListener('click', handleClick);
  refs.list.addEventListener('change', handleChange);
  refs.list.addEventListener('dblclick', handleDoubleClick);
  refs.list.addEventListener('keydown', handleKeyDown);
  refs.list.addEventListener('focusout', handleFocusOut, true);

  refs.filterButtons.forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  refs.toggleAll.addEventListener('click', toggleAll);
  refs.clearCompleted.addEventListener('click', clearCompleted);
}

function handleSubmit(event) {
  event.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
}

function handleClick(event) {
  const todoId = getTodoId(event.target);
  if (!todoId) return;

  if (event.target.dataset.action === 'delete') {
    deleteTodo(todoId);
  }
}

function handleChange(event) {
  const todoId = getTodoId(event.target);
  if (!todoId) return;

  if (event.target.dataset.action === 'toggle') {
    toggleTodo(todoId);
  }
}

function handleDoubleClick(event) {
  if (event.target.dataset.action === 'edit') {
    const todoId = getTodoId(event.target);
    setEditing(todoId);
  }
}

function handleKeyDown(event) {
  const todoId = getTodoId(event.target);
  if (!todoId) return;

  if (event.target.dataset.action === 'edit' && event.key === 'Enter') {
    event.preventDefault();
    setEditing(todoId);
  }

  if (event.target.classList.contains('todo-edit-input')) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit(todoId, event.target.value);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  }
}

function handleFocusOut(event) {
  if (!event.target.classList.contains('todo-edit-input')) return;
  const todoId = getTodoId(event.target);
  if (!todoId) return;
  commitEdit(todoId, event.target.value);
}

function getTodoId(element) {
  const item = element.closest('li[data-id]');
  return item?.dataset.id ?? null;
}
