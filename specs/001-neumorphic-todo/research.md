# Research: Neumorphic Todo List SPA

**Feature Branch**: `001-neumorphic-todo`
**Date**: 2026-02-12
**Status**: Complete — no NEEDS CLARIFICATION items in Technical Context

## Research Topics

### 1. Neumorphic CSS Shadow System

**Decision**: Use CSS custom properties to define a centralized shadow token system. All interactive elements reference shared `--neu-shadow-*` variables. Raised state uses outset shadows; pressed state uses `inset` shadows with identical offsets.

**Rationale**: CSS custom properties allow theme-wide consistency and make it trivial to adjust shadow intensity, distance, or color in one place. The raised/pressed pattern is the canonical neumorphic interaction model and maps directly to the constitution's Principle II and Neumorphic Visual Rules.

**Key implementation details**:
- Base color: `--neu-bg: #e0e0e0` (neutral light gray — provides enough room for ±15% light/dark shadows while maintaining 4.5:1 text contrast with `#333`)
- Light shadow: `--neu-shadow-light: #ffffff` (base lightened ~15%)
- Dark shadow: `--neu-shadow-dark: #bebebe` (base darkened ~15%)
- Shadow distances: small (4px), medium (8px), large (12px) with blur = 2× distance
- Transitions: `box-shadow 150ms ease-in-out` (under the 200ms constitution cap)

**Alternatives considered**:
- **CSS `filter: drop-shadow()`**: Rejected — doesn't support `inset`, so pressed state is impossible.
- **SVG filters for shadows**: Rejected — over-engineered, no browser benefit, harder to maintain.
- **Sass variables**: Rejected — constitution Principle I prohibits preprocessors.

---

### 2. State Management Pattern (Vanilla JS)

**Decision**: Single centralized state object managed by a `store.js` module. The store exposes pure action functions (`addTodo`, `toggleTodo`, `deleteTodo`, etc.) that mutate state and trigger a full re-render. State is serialized to localStorage after every mutation.

**Rationale**: For a small app with ~200 max items, a simple "mutate → re-render → persist" cycle is sufficient. No need for observables, proxies, or event emitters. The single-store pattern satisfies Principle IV (global mutable state confined to one module) and Principle V (persist on every mutation).

**Key implementation details**:
- State shape: `{ schemaVersion: 1, todos: Todo[], filter: 'all' | 'active' | 'completed' }`
- localStorage key: `neumorphic-todo:state`
- On load: read from localStorage → parse → validate schema version → set state (or fall back to empty)
- On mutation: update state → call `render()` → call `persist()`
- Filter state is stored in-memory only (resets to "all" on page load per spec assumption)

**Alternatives considered**:
- **Proxy-based reactivity**: Rejected — adds complexity for marginal gain in an app this size. Proxy traps also make debugging harder.
- **Event-driven / pub-sub**: Rejected — with only one subscriber (the renderer), pub-sub is unnecessary indirection.
- **Redux-like reducer pattern**: Considered — action/reducer separation is cleaner but overkill for 6 actions. Simple functions are more readable.

---

### 3. Accessible Todo List Patterns

**Decision**: Follow the ARIA Authoring Practices Guide for accessible list management. Use semantic HTML (`<ul>`, `<li>`, `<button>`, `<input>`, `<label>`) as the primary accessibility layer. Supplement with ARIA attributes only where native semantics are insufficient.

**Rationale**: Semantic HTML provides the most robust cross-browser/AT support. ARIA is used for dynamic state announcements (`aria-live`) and contextual labels (`aria-label` on buttons that need per-item context like "Delete 'Buy groceries'").

**Key implementation details**:
- Todo list: `<ul role="list">` with `<li>` for each item
- Toggle: `<input type="checkbox">` with `<label>` containing todo text (native semantics for checked/unchecked)
- Edit mode: Replace `<label>` with `<input type="text">` on double-click; manage focus programmatically
- Delete: `<button aria-label="Delete {todo text}">` with visible icon/symbol
- Status announcements: `<div aria-live="polite">` for "X items left", filter changes, and bulk operations
- Focus management: After delete, move focus to next item (or previous if last was deleted). After add, return focus to input.
- Tab order: Input → toggle-all → [todo items in order] → filter buttons → clear completed
- Visible focus: Custom focus ring using `box-shadow` (neumorphic-compatible) with accent color, 3:1 contrast

**Alternatives considered**:
- **`role="listbox"` with `aria-selected`**: Rejected — listbox implies single/multi-selection semantics. A todo list is a plain list with per-item controls.
- **`aria-checked` on `<li>`**: Rejected — using a real `<input type="checkbox">` inside the `<li>` provides native semantics without ARIA.
- **Roving tabindex for list items**: Considered — useful for long lists but adds complexity. Since each list item has multiple controls (checkbox, edit, delete), standard tab order is more intuitive.

---

### 4. localStorage Reliability and Edge Cases

**Decision**: Wrap all localStorage operations in try/catch. On write failure (quota exceeded), show a user-friendly notification via an `aria-live` region and continue operating in session-only mode. On read failure (corrupt data), fall back to empty state with a console warning.

**Rationale**: Constitution Principle V requires graceful fallback. The spec edge case explicitly requires handling storage limits. Try/catch is the simplest and most robust approach.

**Key implementation details**:
- Storage format: `{ schemaVersion: 1, todos: [...] }` serialized as JSON
- Read: `JSON.parse(localStorage.getItem('neumorphic-todo:state'))` in try/catch
- Write: `localStorage.setItem('neumorphic-todo:state', JSON.stringify(state))` in try/catch
- Schema migration: If `schemaVersion` doesn't match current, run migration or reset
- Quota detection: Catch `DOMException` with `name === 'QuotaExceededError'`
- Notification: Render a dismissible banner "Storage full — changes won't be saved after this session"

**Alternatives considered**:
- **IndexedDB**: Rejected — far more complex API for the same data (a single JSON blob). No benefit for this use case.
- **Compression before storage**: Rejected — premature optimization. 200 todos at ~100 bytes each = ~20KB, well within the ~5MB localStorage limit.
- **Debounced persistence**: Considered — could reduce write frequency under rapid toggling. Rejected because localStorage writes are synchronous and fast for this data size; debouncing adds complexity and risks data loss on tab close.

---

### 5. Rendering Strategy

**Decision**: Full re-render of the todo list on every state change. Use `innerHTML` replacement of the list container. Keep the input field and filter bar as persistent DOM — only the list items are re-rendered.

**Rationale**: With up to 200 items, full re-render is well under any performance threshold. Diffing or virtual DOM would be over-engineering. Re-rendering only the list (not the entire page) preserves input focus and filter state naturally.

**Key implementation details**:
- `render()` reads current state from store, applies filter, builds HTML string for `<ul>` contents
- Set `todoList.innerHTML = html` once (single reflow)
- After render, re-attach event listeners via event delegation on the `<ul>` element (not per-item)
- Edit mode: When a todo enters edit mode, render an `<input>` instead of a `<label>`, then call `.focus()` after DOM update

**Alternatives considered**:
- **DOM diffing / morphdom**: Rejected — external dependency violates Principle I, and manual DOM manipulation for this scale is unnecessary.
- **`document.createElement()` per item**: Rejected — more verbose than template strings, harder to read, and no meaningful performance benefit at this scale.
- **Incremental updates (add/remove single DOM nodes)**: Considered — avoids full re-render but requires tracking which items changed. Complexity not justified when full render is <5ms for 200 items.
