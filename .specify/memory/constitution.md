<!--
  Sync Impact Report
  ===========================================================================
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: N/A (initial creation from template)
  Added sections:
    - Principle I: Vanilla Stack Only
    - Principle II: Neumorphic Visual Design
    - Principle III: Accessibility First
    - Principle IV: Maintainable Single-Page Structure
    - Principle V: localStorage Persistence
    - Principle VI: No Secrets, No Server
    - Section: Neumorphic Visual Rules (detailed design constraints)
    - Section: Quality Gates (manual test checklist + lint/format)
    - Governance rules
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no updates needed (Constitution
      Check section is dynamic, filled by /speckit.plan)
    - .specify/templates/spec-template.md ✅ no updates needed (structure is
      generic and compatible)
    - .specify/templates/tasks-template.md ✅ no updates needed (task phases
      are generic and compatible)
    - .specify/templates/commands/*.md — directory empty, no updates needed
  Follow-up TODOs: None
  ===========================================================================
-->

# Neumorphic Todo List Constitution

## Core Principles

### I. Vanilla Stack Only

This project MUST use only vanilla HTML, CSS, and JavaScript. No
frameworks, no build tools, no transpilers, no package managers at
runtime.

- The app MUST consist of a single `index.html` entry point that
  references CSS and JS files directly via `<link>` and `<script>` tags.
- External libraries, CDN imports, and npm dependencies are PROHIBITED.
- CSS MUST be authored as plain `.css` files (no Sass, Less, PostCSS,
  or CSS-in-JS).
- JavaScript MUST target modern evergreen browsers (ES2020+) without
  transpilation or polyfills.
- Dev-time tooling (a linter, a formatter) is permitted but MUST NOT
  be required to run the app.

**Rationale**: Eliminates build complexity, keeps the project trivially
reproducible, and ensures any contributor can open `index.html` in a
browser to run the app.

### II. Neumorphic Visual Design

The UI MUST follow a neumorphic (soft UI) aesthetic with subtle
skeuomorphic touches. Every interactive element MUST appear extruded
from or pressed into the background surface.

- All surfaces MUST share a single base background color; depth is
  conveyed exclusively through light and dark box-shadows.
- Interactive elements MUST have two visual states: "raised" (idle) and
  "pressed" (active/checked), achieved by inverting shadow direction.
- Color palette MUST be limited to one neutral base hue plus one accent
  color for focus/active indicators.
- Flat borders, hard drop shadows, and outline-only buttons are
  PROHIBITED.
- Typography MUST use a single sans-serif system font stack
  (`system-ui, -apple-system, sans-serif`) at no more than three
  size steps (body, heading, small).
- Transitions between states MUST be ≤200 ms and use `ease-in-out`.
- Detailed visual constraints are specified in the "Neumorphic Visual
  Rules" section below.

**Rationale**: Consistent neumorphic design depends on strict shadow
rules; breaking them produces a jarring mix of flat and soft UI that
undermines the aesthetic.

### III. Accessibility First

The app MUST be usable by keyboard-only and screen-reader users and
MUST meet WCAG 2.1 Level AA.

- All interactive elements MUST be reachable and operable via keyboard
  (`Tab`, `Enter`, `Space`, `Escape`).
- Focus indicators MUST be visible and MUST NOT be suppressed. Custom
  focus styles are permitted as long as they meet 3:1 contrast against
  adjacent colors.
- Every form control and interactive region MUST have an accessible
  name (visible `<label>`, `aria-label`, or `aria-labelledby`).
- Status changes (item added, item deleted, filter changed) MUST be
  announced to assistive technology via `aria-live` regions or
  equivalent.
- Text contrast MUST meet 4.5:1 ratio against its background (including
  the neumorphic surface color).
- Semantic HTML elements (`<main>`, `<header>`, `<button>`, `<ul>`,
  `<li>`, `<input>`) MUST be used over generic `<div>`/`<span>` with
  ARIA role overrides wherever a native element exists.

**Rationale**: Neumorphic designs are notorious for poor contrast and
hidden affordances; explicit a11y rules prevent the aesthetic from
harming usability.

### IV. Maintainable Single-Page Structure

The codebase MUST be organized into clearly separated concerns with
predictable file locations.

- HTML structure, CSS styles, and JS logic MUST reside in separate
  files (no inline `<style>` blocks or `<script>` blocks beyond the
  entry-point loader).
- JavaScript MUST be organized into modules using ES module
  (`import`/`export`) syntax with a clear dependency graph: `app.js`
  (entry) → feature modules → utility modules.
- CSS MUST be organized into logical files: reset/base, neumorphic
  design tokens (custom properties), component styles, and layout.
- No file SHOULD exceed ~300 lines. If a module grows beyond this,
  it MUST be split by responsibility.
- Functions and modules MUST have single, clear responsibilities.
  Global mutable state MUST be confined to a single store/state module.

**Rationale**: Vanilla JS projects tend to become monolithic quickly;
explicit structure rules keep the codebase navigable as features grow.

### V. localStorage Persistence

All user data MUST be persisted to `localStorage` so the app survives
page reloads and browser restarts.

- The app MUST serialize the complete todo list state to `localStorage`
  on every mutation (add, edit, delete, toggle, reorder).
- On page load the app MUST restore state from `localStorage` and
  render the full list before the user can interact.
- The storage key MUST be a single, namespaced key
  (e.g., `neumorphic-todo:state`).
- The stored format MUST be JSON and MUST include a schema version
  field so future migrations are possible.
- If `localStorage` is unavailable or the stored data is corrupt, the
  app MUST fall back to an empty state and log a console warning—it
  MUST NOT crash.

**Rationale**: A todo app that loses data on refresh is useless;
localStorage is the simplest persistence layer that requires zero
server infrastructure.

### VI. No Secrets, No Server

This app MUST operate entirely client-side with no server component,
no API calls, and no secrets.

- The repository MUST NOT contain API keys, tokens, credentials, or
  `.env` files.
- The app MUST NOT make any `fetch`, `XMLHttpRequest`, or WebSocket
  calls.
- All functionality MUST work when served from `file://` or a static
  file server with no backend.
- No analytics, tracking scripts, or third-party resources are
  permitted.

**Rationale**: A zero-server architecture eliminates entire classes of
security vulnerabilities and keeps deployment trivial (open the file).

## Neumorphic Visual Rules

Detailed design constraints that expand on Principle II. All
implementors MUST follow these rules when creating or modifying UI
components.

### Surface and Shadow System

- **Base color**: A single neutral hue defined as a CSS custom property
  (`--neu-bg`). All surfaces inherit this color.
- **Light shadow**: Offset toward top-left, color is base lightened by
  ~15% (`--neu-shadow-light`).
- **Dark shadow**: Offset toward bottom-right, color is base darkened
  by ~15% (`--neu-shadow-dark`).
- **Shadow distance**: Consistent across all elements of the same size
  class. Defined via `--neu-shadow-distance` (small: 4px, medium: 8px,
  large: 12px).
- **Blur radius**: 2× the shadow distance.
- **Raised state** (idle): `box-shadow: var(--neu-shadow-distance)
  var(--neu-shadow-distance) var(--neu-blur) var(--neu-shadow-dark),
  calc(-1 * var(--neu-shadow-distance))
  calc(-1 * var(--neu-shadow-distance)) var(--neu-blur)
  var(--neu-shadow-light);`
- **Pressed state** (active): Invert to `inset` shadows with the same
  values.

### Interactive Element Rules

- Buttons, checkboxes, and input fields MUST use the raised/pressed
  shadow pattern.
- Hover state: Slightly reduce shadow distance (e.g., 75% of idle) to
  hint at motion.
- Active/pressed state: Switch to inset shadows.
- Disabled state: Flatten shadows to zero and reduce opacity to 0.5.
- Checked/completed todo items MUST use the pressed (inset) style to
  visually indicate "pushed in."

### Spacing and Border Radius

- Border radius MUST be generous (≥12px for cards, ≥8px for buttons
  and inputs) to maintain the soft appearance.
- Padding MUST be ≥12px on interactive elements to preserve the shadow
  illusion and provide adequate touch targets (≥44px total).
- Margin between sibling elements MUST be ≥16px to prevent shadow
  overlap.

### Color Constraints

- Maximum two hues: one neutral base, one accent.
- Accent color is used ONLY for focus rings, active-state indicators,
  and completion status.
- Text color MUST contrast ≥4.5:1 against `--neu-bg`.
- Do NOT use gradients, textures, or background images on primary
  surfaces.

## Quality Gates

Standards and checklists that MUST be satisfied before any feature is
considered complete.

### Manual Test Checklist

Before marking any task or feature complete, the implementor MUST
manually verify:

1. **Render**: Open `index.html` in Chrome and Firefox (latest).
   The app renders correctly with no console errors.
2. **Add todo**: Type text, press Enter. Item appears in the list
   with raised neumorphic style.
3. **Complete todo**: Click/tap the item or its checkbox. Visual state
   changes to pressed/inset. Completed text is styled distinctly
   (e.g., muted color, strikethrough).
4. **Delete todo**: Remove an item. It disappears. No orphaned DOM
   nodes remain.
5. **Persistence**: Refresh the page. All todos (including completion
   state) are restored from localStorage.
6. **Empty state**: Delete all items. A friendly empty-state message
   appears.
7. **Keyboard navigation**: Tab through all interactive elements.
   Focus ring is visible on each. Enter/Space activates
   buttons/checkboxes. Escape closes any open dialog or edit mode.
8. **Screen reader**: Navigate with VoiceOver (macOS) or NVDA
   (Windows). All elements have accessible names. Status changes
   are announced.
9. **Contrast**: Verify text and interactive element contrast meets
   4.5:1 using browser DevTools or a contrast checker.
10. **Responsive**: Resize viewport from 320px to 1440px width.
    Layout remains usable. No horizontal scrollbar appears. Touch
    targets remain ≥44px.

### Lint and Format Guidance

Automated tooling is lightweight and advisory:

- **HTML**: Validate with the W3C Nu HTML Checker (online or CLI).
  Zero errors required; warnings reviewed case-by-case.
- **CSS**: Use Stylelint with a minimal config (e.g.,
  `stylelint-config-standard`). Fix all errors. Consistent use of
  custom properties for neumorphic tokens is enforced via code review.
- **JavaScript**: Use ESLint with `eslint:recommended` and
  `env: { browser: true, es2020: true }`. Zero errors required.
  Prefer `const`/`let` over `var`. Prefer strict equality (`===`).
- **Formatting**: Use Prettier (or equivalent) with default settings.
  Consistent formatting is required but the specific tool is not
  mandated—manual consistency is acceptable.
- **Pre-commit**: A `.editorconfig` file MUST be present to normalize
  indentation (2 spaces), charset (UTF-8), and final newline across
  editors.

### Definition of Done

A feature is "done" when:

1. All items in the Manual Test Checklist pass.
2. Lint/format tooling reports zero errors.
3. No `TODO` or `FIXME` comments remain in shipped code (move to
   issues instead).
4. The constitution principles have been reviewed against the
   implementation (spot-check, not exhaustive audit).

## Governance

This constitution is the authoritative source of project standards.
All design decisions, code reviews, and implementation work MUST
comply with these principles.

- **Amendments**: Any principle may be amended by updating this
  document. Each amendment MUST include a rationale and MUST increment
  the version number per the versioning policy below.
- **Versioning policy**: MAJOR for principle removals or incompatible
  redefinitions; MINOR for new principles or materially expanded
  guidance; PATCH for clarifications, wording, and typo fixes.
- **Compliance review**: Before any feature is marked complete, the
  implementor MUST verify alignment with all six core principles and
  the quality gates. Violations MUST be resolved or justified with
  an explicit rationale in the relevant spec or plan document.
- **Conflict resolution**: If a principle conflicts with a practical
  requirement, document the conflict in the feature spec, propose an
  amendment, and get approval before proceeding.

**Version**: 1.0.0 | **Ratified**: 2026-02-12 | **Last Amended**: 2026-02-12
