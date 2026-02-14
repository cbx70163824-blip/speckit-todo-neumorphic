const refs = {
  list: document.getElementById('todoList'),
  remainingLabel: document.getElementById('remainingLabel'),
  toggleAll: document.getElementById('toggleAll'),
  clearCompleted: document.getElementById('clearCompleted'),
  filterButtons: [...document.querySelectorAll('[data-filter]')]
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const filterTodos = (todos, filter) => {
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
};

export function render(state) {
  renderTodos(state);
  renderCounts(state);
  renderFilters(state);
  renderBulkButtons(state);
}

function renderTodos(state) {
  const items = filterTodos(state.todos, state.filter);
  if (!items.length) {
    refs.list.innerHTML = '<li class="todo-item empty" role="note">No todos to show</li>';
    return;
  }

  const markup = items
    .map((todo) => {
      const isEditing = todo.id === state.editingId;
      return `
        <li class="todo-item" data-id="${todo.id}">
          <input
            type="checkbox"
            class="todo-checkbox"
            data-action="toggle"
            ${todo.completed ? 'checked' : ''}
            aria-label="${todo.completed ? 'Mark as active' : 'Mark as completed'}"
          />
          <div class="todo-label-container">
            ${isEditing ? renderEditField(todo) : renderDisplayLabel(todo)}
          </div>
          <div class="todo-actions">
            <button type="button" class="todo-delete" data-action="delete" aria-label="Delete ${escapeHtml(todo.text)}">✕</button>
          </div>
        </li>`;
    })
    .join('');

  refs.list.innerHTML = markup;

  if (state.editingId) {
    const editField = refs.list.querySelector('.todo-edit-input');
    if (editField) {
      requestAnimationFrame(() => {
        editField.focus();
        editField.select();
      });
    }
  }
}

function renderDisplayLabel(todo) {
  const classes = ['todo-label'];
  if (todo.completed) classes.push('completed');
  const safeText = escapeHtml(todo.text);
  return `<span class="${classes.join(' ')}" data-action="edit" tabindex="0" role="textbox" aria-readonly="true">${safeText}</span>`;
}

function renderEditField(todo) {
  const safeText = escapeHtml(todo.text);
  return `<input type="text" class="todo-edit-input" value="${safeText}" data-editing-id="${todo.id}" aria-label="Editing ${safeText}" maxlength="240" />`;
}

function renderCounts(state) {
  const remaining = state.todos.filter((todo) => !todo.completed).length;
  const noun = remaining === 1 ? 'item' : 'items';
  refs.remainingLabel.textContent = `${remaining} ${noun} left`;
}

function renderFilters(state) {
  refs.filterButtons.forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function renderBulkButtons(state) {
  const hasTodos = state.todos.length > 0;
  const completedCount = state.todos.filter((todo) => todo.completed).length;
  refs.toggleAll.disabled = !hasTodos;
  refs.clearCompleted.disabled = completedCount === 0;
}

export function getRefs() {
  return refs;
}
