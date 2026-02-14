# Contract: Store Interface (js/store.js)

**Feature Branch**: `001-neumorphic-todo`
**Date**: 2026-02-12

This contract defines the public API of the state management module. All state mutations go through the store. The store is the single source of truth.

## Module Exports

### `getState() → AppState`

Returns the current application state (read-only reference).

```js
// Returns:
{
  schemaVersion: 1,
  todos: Todo[],
  filter: 'all' | 'active' | 'completed',
  editingId: string | null
}
```

### `addTodo(text: string) → void`

Creates a new todo item and appends it to the list.

- **Precondition**: `text.trim().length > 0`
- **Effect**: Appends `{ id: crypto.randomUUID(), text: text.trim(), completed: false, createdAt: Date.now() }` to `todos`
- **Side effects**: Persists to localStorage, triggers re-render
- **No-op if**: `text` is empty or whitespace-only

### `toggleTodo(id: string) → void`

Flips the `completed` state of the identified todo.

- **Precondition**: Todo with `id` exists
- **Effect**: `todo.completed = !todo.completed`
- **Side effects**: Persists to localStorage, triggers re-render

### `editTodo(id: string, newText: string) → void`

Updates the text of the identified todo.

- **Precondition**: Todo with `id` exists; `newText.trim().length > 0`
- **Effect**: `todo.text = newText.trim()`
- **Side effects**: Persists to localStorage, triggers re-render
- **No-op if**: `newText` is empty or whitespace-only (original text preserved)

### `deleteTodo(id: string) → void`

Removes the identified todo from the list.

- **Precondition**: Todo with `id` exists
- **Effect**: `todos = todos.filter(t => t.id !== id)`
- **Side effects**: Persists to localStorage, triggers re-render

### `toggleAll() → void`

Sets all todos to completed if any are active; otherwise sets all to active.

- **Effect**: If `activeTodos.length > 0`, set all `completed = true`. Else set all `completed = false`.
- **Side effects**: Persists to localStorage, triggers re-render

### `clearCompleted() → void`

Removes all completed todos from the list.

- **Effect**: `todos = todos.filter(t => !t.completed)`
- **Side effects**: Persists to localStorage, triggers re-render

### `setFilter(filter: 'all' | 'active' | 'completed') → void`

Changes the active filter view.

- **Effect**: `state.filter = filter`
- **Side effects**: Triggers re-render (no localStorage write — filter is transient)

### `setEditing(id: string | null) → void`

Enters or exits inline edit mode for a todo.

- **Effect**: `state.editingId = id`
- **Side effects**: Triggers re-render (no localStorage write — editing state is transient)

### `subscribe(callback: () → void) → void`

Registers a callback to be invoked after every state change.

- **Usage**: `render` function subscribes on init
- **Guarantee**: Callback is called synchronously after state mutation and persistence

### `init() → void`

Loads state from localStorage (or falls back to defaults) and notifies subscribers.

- **Called once** from `app.js` on DOMContentLoaded
- **Fallback**: If localStorage is empty, corrupt, or unavailable, initializes with `{ schemaVersion: 1, todos: [], filter: 'all', editingId: null }`

## Persistence Contract

| Event | localStorage Write? |
|-------|-------------------|
| `addTodo` | Yes |
| `toggleTodo` | Yes |
| `editTodo` | Yes |
| `deleteTodo` | Yes |
| `toggleAll` | Yes |
| `clearCompleted` | Yes |
| `setFilter` | No (transient) |
| `setEditing` | No (transient) |

**Serialized fields**: Only `schemaVersion` and `todos` are written to localStorage.
**Key**: `neumorphic-todo:state`
