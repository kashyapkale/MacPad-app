<p align="center">
  <img src="https://img.shields.io/badge/MacPad++-v1.0-brightgreen?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/react-18-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<h1 align="center">
  <br />
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%2390EE90'/%3E%3Ctext x='8' y='48' font-size='42' font-family='monospace' font-weight='bold' fill='%23006400'%3EM%2B%3C/text%3E%3C/svg%3E" width="80" alt="MacPad++ Logo" />
  <br />
  MacPad++
  <br />
</h1>

<h3 align="center">A fast, lightweight Notepad++ clone for the web. No bloat. No accounts. No nonsense.</h3>

<p align="center">
  <a href="https://macpad.app">Live App</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#roadmap">Roadmap</a>
</p>

---

## The Problem

Every text editor today wants to be something more than a text editor.

They want your email. They want a subscription. They want to sync to their cloud. They want to run AI on your notes. They ship 200MB Electron apps to render a blinking cursor on a white page. They add "collaboration," "templates," "smart folders," and fifteen other features nobody asked for — all while the app takes 4 seconds to open.

**Notepad++ understood something that most modern apps have forgotten: sometimes you just need to edit text.**

Millions of developers and writers relied on Notepad++ daily. It was fast. It was light. It launched instantly. It never asked you to sign in. It never sold your data. It just worked.

But Notepad++ was never available on macOS. And on the web? Nothing comes close to its speed and simplicity.

## The Philosophy

MacPad++ exists because we believe:

- **A text editor should open instantly.** Not in 4 seconds. Not after a splash screen. Instantly.
- **Your notes belong to you.** They live in your browser's local storage. We don't have a server. We can't see your data. Period.
- **Features should earn their place.** Every button, every menu item, every line of code must justify its existence. If it doesn't help you edit text faster, it doesn't ship.
- **Software doesn't need an account.** Open the page. Start typing. That's it. No sign-up. No trial. No "continue with Google."
- **Lightweight is a feature, not a limitation.** The entire app is under 200KB of application code. It loads faster than most apps render their loading spinner.

MacPad++ is a love letter to Notepad++ — rebuilt for the modern web with the same principles: speed, simplicity, and respect for the user.

## Features

### Editor
- **Full syntax highlighting** for 20+ languages — JavaScript, TypeScript, Python, C/C++, Java, Rust, Go, HTML, CSS, SQL, PHP, Ruby, Markdown, YAML, and more
- **Line numbers** with code folding
- **Find & Replace** with regex support, match case, whole word, wrap around
- **Go to Line** (Ctrl+G)
- **Multiple tabs** — work on many files simultaneously
- **Bracket matching** and auto-close
- **Active line highlighting**
- **Configurable tab size** (2, 4, 8) with spaces or tabs
- **Zoom in/out** (Ctrl+/-)
- **Word wrap** toggle
- **Document minimap**
- **Dark mode**

### File Operations
- **Open local files** — drag & drop or Ctrl+O
- **Save / Save As** — downloads to your machine
- **Auto-detect language** from file extension
- **Tab rename** via right-click context menu

### Notepad++ DNA
- **Authentic UI** — Windows-style menu bar, toolbar with classic icons, tab bar, status bar
- **Keyboard shortcuts** — Ctrl+N, Ctrl+S, Ctrl+W, Ctrl+F, Ctrl+H, Ctrl+G, F3, and more
- **Right-click context menus** on editor and tabs
- **Status bar** showing line, column, selection, document length, encoding, and language
- **Text tools** — sort lines, remove duplicates, remove empty lines, trim whitespace, uppercase/lowercase

### Storage
- **100% local** — all tabs, content, cursor positions, scroll positions, and settings are saved to `localStorage`
- **Survives refresh** — close the browser, come back, everything is exactly where you left it
- **Zero network requests** for data storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
git clone https://github.com/kashyapkale/MacPad-app.git
cd MacPad-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

The built files are in `dist/` — deploy them to any static hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, etc.).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 6 |
| **Code Editor** | CodeMirror 6 via `@uiw/react-codemirror` |
| **State Management** | React Context + `useReducer` |
| **Storage** | Browser `localStorage` |
| **Styling** | Vanilla CSS (no framework, no utility classes) |
| **Languages** | 20+ via `@codemirror/lang-*` packages |
| **Dark Theme** | `@codemirror/theme-one-dark` + custom CSS variables |

### Architecture

```
src/̌
├── main.tsx              # App entry point
├── App.tsx               # Root layout + keyboard shortcuts
├── App.css               # All styles (single file, organized by component)
├── types.ts              # TypeScript interfaces & types
├── constants.tsx          # Icons, languages, menus, toolbar definitions
├── store.tsx             # React Context + useReducer state management
└── components/
    ├── MenuBar.tsx        # Windows-style dropdown menus
    ├── Toolbar.tsx        # Icon toolbar
    ├── TabBar.tsx         # File tabs with close/rename/context menu
    ├── Editor.tsx         # CodeMirror 6 wrapper
    ├── StatusBar.tsx      # Line/col/selection/encoding info
    ├── FindReplaceDialog.tsx  # Find & replace with regex
    ├── GoToLineDialog.tsx     # Go to line number
    ├── AboutDialog.tsx        # About dialog
    └── ContextMenu.tsx        # Right-click context menu
```

### Design Decisions

- **Single CSS file** — No CSS-in-JS, no Tailwind, no modules. One file, organized by component sections. Easy to read, easy to override, zero runtime cost.
- **useReducer over Redux** — The state is complex but local. No need for external state libraries. The reducer pattern gives predictable updates without the boilerplate.
- **CodeMirror 6** — The best code editor library available. Modular, performant, extensible. Language support loaded on demand.
- **No backend** — This is a deliberate choice, not a limitation. Your text editor should not need a server.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New tab |
| `Ctrl+O` | Open file |
| `Ctrl+S` | Save file |
| `Ctrl+Shift+S` | Save as |
| `Ctrl+W` | Close tab |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+F` | Find |
| `Ctrl+H` | Replace |
| `Ctrl+G` | Go to line |
| `Ctrl+A` | Select all |
| `Ctrl+U` | Lowercase |
| `Ctrl+Shift+U` | Uppercase |
| `Ctrl++` | Zoom in |
| `Ctrl+-` | Zoom out |
| `Ctrl+0` | Reset zoom |
| `F3` | Find next |
| `Shift+F3` | Find previous |
| `Esc` | Close dialogs |

## Roadmap

### Phase 1 — Web App (Current)
- [x] Core editor with syntax highlighting
- [x] Multi-tab support with localStorage persistence
- [x] Find & Replace with regex
- [x] Full menu system, toolbar, status bar
- [x] Dark mode
- [x] Keyboard shortcuts
- [x] Drag & drop file open
- [x] Right-click context menus

### Phase 2 — Cloud Integration
- [ ] **Google Docs integration** — Save and sync notes to Google Drive. Open Google Docs directly in MacPad++. Edit with the speed of a native editor, save back to the cloud.
- [ ] **Optional sign-in** — Only if you want cloud sync. The app works fully offline without any account.
- [ ] Export to Google Docs / import from Google Docs
- [ ] Conflict resolution for concurrent edits

### Phase 3 — Native Mac App
- [ ] **macOS desktop app** via Tauri (lightweight, not Electron)
- [ ] Native file system access — open/save files directly
- [ ] System menu bar integration
- [ ] Spotlight integration
- [ ] Auto-update

### Phase 4 — Collaboration (Maybe)
- [ ] Real-time collaboration via WebRTC (peer-to-peer, no server)
- [ ] Share a tab with a link
- [ ] Cursor presence

> **Note:** Phase 4 is intentionally marked "maybe." We will not add collaboration if it compromises speed or simplicity. The moment a feature makes the app slower for solo users, it doesn't ship.

## Contributing

Contributions are welcome. Please keep the philosophy in mind:

1. **Speed is sacred.** If your change adds latency, it needs a very good reason.
2. **Simplicity over features.** Less is more. Every addition should be scrutinized.
3. **No new dependencies without discussion.** Open an issue first.

```bash
# Fork the repo
git clone https://github.com/your-username/MacPad-app.git
cd MacPad-app
npm install
npm run dev
```

## License

MIT — do whatever you want with it.

---

<p align="center">
  <strong>MacPad++</strong> — Because a text editor should edit text.
</p>
