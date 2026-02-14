# Implementation Plan: Neumorphic Todo List SPA

**Branch**: `001-neumorphic-todo` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-neumorphic-todo/spec.md`

## Summary

Build a neumorphic-styled todo list single-page application using vanilla HTML, CSS, and JavaScript with zero build tools. The app supports full CRUD (add, toggle, edit, delete), status filtering (All/Active/Completed), bulk operations (clear completed, toggle all), and persists state to localStorage. The UI follows strict neumorphic shadow conventions with WCAG AA accessibility compliance. Served as static files via `python -m http.server`.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020+ (ES modules)
**Primary Dependencies**: None — vanilla stack per constitution
**Storage**: Browser `localStorage` with namespaced key (`neumorphic-todo:state`) and schema versioning
**Testing**: Manual testing per constitution Quality Gates checklist; optional ESLint/Stylelint for linting
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 major versions)
**Project Type**: Single static web application (no build step, no server)
**Performance Goals**: Interactive within 1 second; handles 200+ todos without perceptible lag (SC-006, SC-008)
**Constraints**: No frameworks, no CDN imports, no `fetch`/XHR calls, no build tools; WCAG 2.1 AA compliance; all text ≥4.5:1 contrast ratio
**Scale/Scope**: Single-user, single-device; ~5 user stories; estimated 6–8 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Vanilla Stack Only | ✅ PASS | No frameworks, no build tools, no CDN. Pure HTML/CSS/JS with ES modules. |
| II | Neumorphic Visual Design | ✅ PASS | Shadow system via CSS custom properties. Raised/pressed states for all interactive elements. Single neutral base + one accent color. |
| III | Accessibility First | ✅ PASS | Semantic HTML, ARIA labels, `aria-live` regions, keyboard navigation, visible focus indicators, 4.5:1 contrast. |
| IV | Maintainable Single-Page Structure | ✅ PASS | Separate HTML/CSS/JS files. ES module dependency graph: `app.js` → feature modules → utilities. No file >300 lines. |
| V | localStorage Persistence | ✅ PASS | Namespaced key `neumorphic-todo:state`, JSON with schema version, graceful fallback on corruption/unavailability. |
| VI | No Secrets, No Server | ✅ PASS | Fully client-side. No fetch/XHR/WebSocket. No API keys. Works from `file://` or static server. |

**Gate result: ALL PASS — proceed to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-neumorphic-todo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (localStorage & state interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
index.html                # Single entry point; references CSS and JS
css/
├── reset.css             # Minimal CSS reset / box-sizing normalization
├── tokens.css            # Neumorphic design tokens (custom properties)
├── components.css        # Component-specific styles (input, todo item, filters, etc.)
└── layout.css            # Page layout, responsive breakpoints, spacing
js/
├── app.js                # Entry point — initializes store, renders, binds events
├── store.js              # State management + localStorage read/write
├── render.js             # DOM rendering functions (todo list, filters, counters)
└── events.js             # Event delegation and handler wiring
```

**Structure Decision**: Flat single-project layout with CSS and JS in dedicated subdirectories. No `src/` wrapper — keeps paths short and mirrors the simplicity of a static site. ES modules (`type="module"` on the script tag) provide dependency management without bundling.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design artifacts are complete.*

| # | Principle | Status | Verification |
|---|-----------|--------|-------------|
| I | Vanilla Stack Only | ✅ PASS | File structure has only `.html`, `.css`, `.js` files. No package.json, no build config. ES modules via `type="module"` — native browser support, no bundler. |
| II | Neumorphic Visual Design | ✅ PASS | `tokens.css` defines `--neu-bg`, `--neu-shadow-light`, `--neu-shadow-dark`, `--neu-shadow-distance`, `--neu-blur`. Raised/pressed states via outset/inset shadows. Single accent color for focus. Transitions ≤200ms. |
| III | Accessibility First | ✅ PASS | Render contract specifies semantic HTML (`<ul>`, `<li>`, `<input>`, `<button>`, `<label>`), `aria-label` on contextual buttons, `aria-live` region for status announcements. Focus management rules defined in event contract. |
| IV | Maintainable Single-Page Structure | ✅ PASS | 4 CSS files + 4 JS files, each with single responsibility. ES module graph: `app.js` → `store.js`, `render.js`, `events.js`. No file expected to exceed 300 lines. |
| V | localStorage Persistence | ✅ PASS | Store contract defines namespaced key `neumorphic-todo:state`, JSON with `schemaVersion`, write-on-every-mutation, graceful fallback on corruption/quota. |
| VI | No Secrets, No Server | ✅ PASS | No fetch/XHR in any contract. No API endpoints. Quickstart uses `python -m http.server` (static file serving only). |

**Post-design gate result: ALL PASS.**

## Complexity Tracking

No constitution violations detected — this table is intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *(none)* | — | — |
