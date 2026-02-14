# Contract: Render Interface (js/render.js)

**Feature Branch**: `001-neumorphic-todo`
**Date**: 2026-02-12

This contract defines the rendering functions that translate state into DOM.

## Module Exports

### `render() → void`

Main render function. Reads state from `store.getState()` and updates the DOM.

**Responsibilities**:
1. Compute `filteredTodos` from `todos` + `filter`
2. Render todo list items into `#todo-list` (`<ul>`)
3. Update active count in `#todo-count`
4. Update filter button active states in `#filters`
5. Show/hide/disable "Clear Completed" button based on `hasCompleted`
6. Update "Toggle All" checkbox state based on `allCompleted`
7. Show/hide empty state message when `todos.length === 0`
8. Update `aria-live` region with status changes

### `renderTodoItem(todo: Todo, isEditing: boolean) → string`

Returns the HTML string for a single todo list item.

**HTML structure** (per item):
```html
<li class="todo-item {completed ? 'completed' : ''}" data-id="{todo.id}">
  <!-- Normal mode -->
  <div class="todo-view">
    <input
      class="todo-toggle"
      type="checkbox"
      {completed ? 'checked' : ''}
      id="todo-{todo.id}"
      aria-label="Mark '{todo.text}' as {completed ? 'active' : 'complete'}"
    />
    <label class="todo-text" for="todo-{todo.id}">
      {todo.text}
    </label>
    <button
      class="todo-delete"
      aria-label="Delete '{todo.text}'"
    >×</button>
  </div>
  <!-- Edit mode (when isEditing === true) -->
  <input
    class="todo-edit"
    type="text"
    value="{todo.text}"
    aria-label="Edit todo"
  />
</li>
```

**CSS classes for state**:
- `.todo-item` — base neumorphic raised style
- `.todo-item.completed` — pressed/inset neumorphic style, muted text, strikethrough
- `.todo-item.editing` — hides `.todo-view`, shows `.todo-edit`

### `renderEmptyState() → string`

Returns HTML for the empty state message when no todos exist.

```html
<li class="empty-state" aria-hidden="true">
  <p>No todos yet. Add one above!</p>
</li>
```

### `updateAriaStatus(message: string) → void`

Sets the text content of the `aria-live="polite"` region to announce status changes.

**Triggered by**:
- Adding a todo: "Todo added"
- Deleting a todo: "Todo deleted"
- Toggling a todo: "{text} marked as {complete/active}"
- Clearing completed: "{count} completed todos cleared"
- Changing filter: "Showing {filter} todos"

## DOM Element IDs

| ID | Element | Purpose |
|----|---------|---------|
| `#todo-form` | `<form>` | New todo input form |
| `#todo-input` | `<input>` | Text input for new todos |
| `#toggle-all` | `<input[checkbox]>` | Toggle all todos complete/active |
| `#todo-list` | `<ul>` | Container for todo list items |
| `#todo-count` | `<span>` | Active item count display |
| `#filters` | `<div>` | Filter button container |
| `#clear-completed` | `<button>` | Clear completed action |
| `#aria-status` | `<div aria-live>` | Screen reader announcements |
