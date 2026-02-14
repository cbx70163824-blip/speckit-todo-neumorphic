# Quickstart: Neumorphic Todo List SPA

**Feature Branch**: `001-neumorphic-todo`
**Date**: 2026-02-12

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge — latest 2 major versions)
- Python 3.x (for the local dev server) — any version with `http.server` module

## Run the App

### Option 1: Python HTTP Server (recommended for ES modules)

```bash
# From the repository root
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

> **Why a server?** ES modules (`import`/`export`) require HTTP(S) — they don't work over `file://` due to CORS restrictions. A static server is the simplest solution.

### Option 2: Any Static File Server

```bash
# Node.js (if available)
npx serve .

# Ruby
ruby -run -ehttpd . -p8080

# PHP
php -S localhost:8080
```

### Option 3: Direct File Open (limited)

Open `index.html` directly in the browser. This works for the HTML/CSS but **ES modules will fail** due to CORS. To use this option, the JS files would need to be loaded as classic scripts instead of modules.

## Project File Layout

```
.
├── index.html              # Entry point
├── css/
│   ├── reset.css           # CSS reset / normalization
│   ├── tokens.css          # Neumorphic design tokens (custom properties)
│   ├── components.css      # Component styles
│   └── layout.css          # Page layout + responsive
└── js/
    ├── app.js              # Initialization
    ├── store.js            # State management + localStorage
    ├── render.js           # DOM rendering
    └── events.js           # Event handling + delegation
```

## Development Workflow

1. **Edit** any `.html`, `.css`, or `.js` file in your editor
2. **Refresh** the browser to see changes (no build step, no hot reload needed)
3. **Inspect** localStorage in browser DevTools → Application → Local Storage → look for key `neumorphic-todo:state`

## Manual Testing Checklist (from Constitution)

After making changes, verify:

1. App renders in Chrome and Firefox with no console errors
2. Add a todo via Enter key — it appears with raised neumorphic style
3. Click checkbox to complete — visual state changes to pressed/inset
4. Delete a todo — it disappears cleanly
5. Refresh the page — all todos persist
6. Delete all todos — empty state message appears
7. Tab through all controls — focus ring is visible
8. Resize viewport 320px–1440px — no horizontal scroll, touch targets ≥44px

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page with console CORS errors | Use a local HTTP server (Option 1) instead of `file://` |
| Changes not appearing | Hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass cache |
| Todos disappeared | Check DevTools → Application → Local Storage. If the key is missing, storage was cleared. |
| "Storage full" banner | Clear old data from localStorage or use a different browser profile |
