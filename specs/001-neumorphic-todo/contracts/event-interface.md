# Contract: Event Interface (js/events.js)

**Feature Branch**: `001-neumorphic-todo`
**Date**: 2026-02-12

This contract defines how user interactions map to store actions. All event handling uses delegation on stable parent containers.

## Event Delegation Strategy

All list-item events are delegated to the `<ul>` container. Form events attach to the input form. Filter events attach to the filter bar. This avoids re-attaching listeners on re-render.

## Event → Action Mapping

| User Action | DOM Event | Target Selector | Store Action |
|-------------|-----------|-----------------|--------------|
| Type text + press Enter | `submit` on `<form>` | `#todo-form` | `addTodo(inputValue)` |
| Click submit button | `submit` on `<form>` | `#todo-form` | `addTodo(inputValue)` |
| Click checkbox | `change` on `<input[type=checkbox]>` | `.todo-toggle` within `<ul>` | `toggleTodo(id)` |
| Double-click todo text | `dblclick` on `<label>` | `.todo-text` within `<ul>` | `setEditing(id)` |
| Press Enter in edit field | `keydown` (Enter) on `<input>` | `.todo-edit` within `<ul>` | `editTodo(id, value)` then `setEditing(null)` |
| Press Escape in edit field | `keydown` (Escape) on `<input>` | `.todo-edit` within `<ul>` | `setEditing(null)` |
| Blur edit field | `focusout` on `<input>` | `.todo-edit` within `<ul>` | `editTodo(id, value)` then `setEditing(null)` |
| Click delete button | `click` on `<button>` | `.todo-delete` within `<ul>` | `deleteTodo(id)` |
| Click filter button | `click` on `<button>` | `.filter-btn` within `#filters` | `setFilter(filterValue)` |
| Click "Clear Completed" | `click` on `<button>` | `#clear-completed` | `clearCompleted()` |
| Click "Toggle All" | `change` on `<input[type=checkbox]>` | `#toggle-all` | `toggleAll()` |

## Focus Management Rules

| After Action | Focus Target |
|-------------|-------------|
| Add todo | Clear and re-focus the input field |
| Delete todo | Next todo item's checkbox, or previous if last was deleted, or input if list is empty |
| Enter edit mode | The inline edit `<input>` |
| Confirm edit | The todo item's `<label>` (or checkbox) |
| Cancel edit | The todo item's `<label>` (or checkbox) |
| Clear completed | Input field |

## Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| `Enter` | Input field | Submit new todo |
| `Enter` | Edit field | Confirm edit |
| `Escape` | Edit field | Cancel edit |
| `Space` | Focused checkbox | Toggle todo |
| `Tab` | Any | Move to next focusable element |
| `Shift+Tab` | Any | Move to previous focusable element |
