# Data Model: Neumorphic Todo List SPA

**Feature Branch**: `001-neumorphic-todo`
**Date**: 2026-02-12

## Entities

### Todo

Represents a single task in the todo list.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `string` | Required, unique, UUID v4 format | Unique identifier generated via `crypto.randomUUID()` |
| `text` | `string` | Required, non-empty after trim, max display ~500 chars (soft) | The task description entered by the user |
| `completed` | `boolean` | Required, default `false` | Whether the task has been marked as done |
| `createdAt` | `number` | Required, Unix timestamp (ms) | `Date.now()` at creation time; used for stable ordering |

**Validation rules**:
- `text` MUST NOT be empty or whitespace-only (applies to both creation and edit)
- `id` MUST be unique across all todos in state
- `completed` MUST be strictly boolean (not truthy/falsy)

**State transitions**:

```
[Created] → active (completed: false)
    ↕ toggle
[Completed] → completed (completed: true)
    ↕ toggle
[Active] → active (completed: false)
    → [Deleted] (removed from array)
```

### AppState (persisted)

The root state object serialized to localStorage.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `schemaVersion` | `number` | Required, current: `1` | Enables future data migrations |
| `todos` | `Todo[]` | Required, default `[]` | Ordered array of all todo items (creation order) |

**Note**: `filter` is NOT persisted. Per spec assumption, filter resets to "all" on each page load.

### ViewState (in-memory only)

Transient UI state that lives only in the JavaScript runtime.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `filter` | `'all' \| 'active' \| 'completed'` | `'all'` | Currently active filter view |
| `editingId` | `string \| null` | `null` | ID of the todo currently being edited inline, or null |

## Derived Data

These values are computed from state on each render — never stored:

| Derived | Computation | Used For |
|---------|-------------|----------|
| `activeTodos` | `todos.filter(t => !t.completed)` | "Active" filter view, item count display |
| `completedTodos` | `todos.filter(t => t.completed)` | "Completed" filter view, "Clear Completed" visibility |
| `activeCount` | `activeTodos.length` | Footer counter: "X items left" |
| `hasCompleted` | `completedTodos.length > 0` | Show/hide "Clear Completed" button |
| `allCompleted` | `todos.length > 0 && activeCount === 0` | "Toggle All" checkbox state |
| `filteredTodos` | Todos matching current filter | Rendered list |

## localStorage Schema

**Key**: `neumorphic-todo:state`

**Value** (JSON):

```json
{
  "schemaVersion": 1,
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "text": "Buy groceries",
      "completed": false,
      "createdAt": 1707700000000
    }
  ]
}
```

**Schema migration strategy**: On load, if `schemaVersion` is less than current, run migration functions in sequence (v1→v2, v2→v3, etc.). If `schemaVersion` is missing or invalid, reset to empty state.

## Invariants

1. Every todo in `todos` has a unique `id`
2. `todos` array order = creation order (append-only; no reordering)
3. `text` is always a non-empty, trimmed string
4. `schemaVersion` is always present and numeric
5. After any mutation, localStorage is updated synchronously (or fails gracefully)
