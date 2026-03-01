import type { MenuDef } from './types';

// ============================================================
// SVG Icons
// ============================================================
export const ICONS: Record<string, JSX.Element> = {
  newFile: (
    <svg viewBox="0 0 16 16">
      <path d="M3 1h7l3 3v11H3V1z" fill="#fff" stroke="#666" strokeWidth="1" />
      <path d="M10 1v3h3" fill="none" stroke="#666" strokeWidth="1" />
    </svg>
  ),
  open: (
    <svg viewBox="0 0 16 16">
      <path d="M1 3h5l2 2h6v9H1V3z" fill="#ffd866" stroke="#c8a83e" strokeWidth="0.7" />
      <path d="M1 6h12l2 8H3L1 6z" fill="#ffe8a0" stroke="#c8a83e" strokeWidth="0.7" />
    </svg>
  ),
  save: (
    <svg viewBox="0 0 16 16">
      <path d="M2 1h10l2 2v11H2V1z" fill="#5b9bd5" stroke="#4178a4" strokeWidth="0.7" />
      <rect x="4" y="1" width="7" height="5" fill="#fff" stroke="#4178a4" strokeWidth="0.5" />
      <rect x="4" y="9" width="8" height="5" fill="#fff" rx="1" />
      <rect x="8" y="2" width="2" height="3" fill="#5b9bd5" />
    </svg>
  ),
  saveAll: (
    <svg viewBox="0 0 16 16">
      <path d="M4 3h8l2 2v9H4V3z" fill="#5b9bd5" stroke="#4178a4" strokeWidth="0.7" />
      <rect x="6" y="3" width="5" height="4" fill="#fff" stroke="#4178a4" strokeWidth="0.5" />
      <rect x="6" y="10" width="6" height="3" fill="#fff" rx="1" />
      <path d="M2 1h8l2 2" fill="none" stroke="#4178a4" strokeWidth="0.7" />
      <path d="M2 1v11" fill="none" stroke="#4178a4" strokeWidth="0.7" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 16 16">
      <line x1="4" y1="4" x2="12" y2="12" stroke="#e81123" strokeWidth="1.5" />
      <line x1="12" y1="4" x2="4" y2="12" stroke="#e81123" strokeWidth="1.5" />
    </svg>
  ),
  cut: (
    <svg viewBox="0 0 16 16">
      <circle cx="5" cy="12" r="2.5" fill="none" stroke="#666" strokeWidth="1" />
      <circle cx="11" cy="12" r="2.5" fill="none" stroke="#666" strokeWidth="1" />
      <line x1="5" y1="10" x2="10" y2="2" stroke="#666" strokeWidth="1.2" />
      <line x1="11" y1="10" x2="6" y2="2" stroke="#666" strokeWidth="1.2" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 16 16">
      <rect x="4" y="4" width="9" height="11" fill="#fff" stroke="#666" strokeWidth="1" />
      <rect x="2" y="1" width="9" height="11" fill="#fff" stroke="#666" strokeWidth="1" />
    </svg>
  ),
  paste: (
    <svg viewBox="0 0 16 16">
      <rect x="3" y="3" width="11" height="12" fill="#ffe8a0" stroke="#c8a83e" strokeWidth="0.7" rx="1" />
      <rect x="5" y="1" width="6" height="3" fill="#c8a83e" rx="1" />
      <line x1="5" y1="7" x2="12" y2="7" stroke="#666" strokeWidth="0.7" />
      <line x1="5" y1="9" x2="12" y2="9" stroke="#666" strokeWidth="0.7" />
      <line x1="5" y1="11" x2="10" y2="11" stroke="#666" strokeWidth="0.7" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 16 16">
      <path d="M5 6l-4 3 4 3" fill="none" stroke="#5b9bd5" strokeWidth="1.5" />
      <path d="M1 9h9a4 4 0 0 1 0 8H6" fill="none" stroke="#5b9bd5" strokeWidth="1.5" />
    </svg>
  ),
  redo: (
    <svg viewBox="0 0 16 16">
      <path d="M11 6l4 3-4 3" fill="none" stroke="#5b9bd5" strokeWidth="1.5" />
      <path d="M15 9H6a4 4 0 0 0 0 8h4" fill="none" stroke="#5b9bd5" strokeWidth="1.5" />
    </svg>
  ),
  find: (
    <svg viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4" fill="none" stroke="#666" strokeWidth="1.3" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="#666" strokeWidth="1.5" />
    </svg>
  ),
  replace: (
    <svg viewBox="0 0 16 16">
      <circle cx="6" cy="6" r="3.5" fill="none" stroke="#666" strokeWidth="1.2" />
      <line x1="9" y1="9" x2="12" y2="12" stroke="#666" strokeWidth="1.3" />
      <path d="M11 12l3 0 0-3" fill="none" stroke="#e81123" strokeWidth="1" />
    </svg>
  ),
  zoomIn: (
    <svg viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4" fill="none" stroke="#666" strokeWidth="1.2" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="#666" strokeWidth="1.5" />
      <line x1="5" y1="7" x2="9" y2="7" stroke="#666" strokeWidth="1.2" />
      <line x1="7" y1="5" x2="7" y2="9" stroke="#666" strokeWidth="1.2" />
    </svg>
  ),
  zoomOut: (
    <svg viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4" fill="none" stroke="#666" strokeWidth="1.2" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="#666" strokeWidth="1.5" />
      <line x1="5" y1="7" x2="9" y2="7" stroke="#666" strokeWidth="1.2" />
    </svg>
  ),
  wordWrap: (
    <svg viewBox="0 0 16 16">
      <line x1="2" y1="3" x2="14" y2="3" stroke="#666" strokeWidth="1.2" />
      <path d="M2 7h10a2 2 0 0 1 0 4H8" fill="none" stroke="#666" strokeWidth="1.2" />
      <path d="M10 9l-2 2 2 2" fill="none" stroke="#666" strokeWidth="1.2" />
      <line x1="2" y1="13" x2="8" y2="13" stroke="#666" strokeWidth="1.2" />
    </svg>
  ),
  showAll: (
    <svg viewBox="0 0 16 16">
      <text x="3" y="12" fontSize="13" fontFamily="serif" fill="#666">¶</text>
    </svg>
  ),
  indent: (
    <svg viewBox="0 0 16 16">
      <line x1="6" y1="3" x2="14" y2="3" stroke="#666" strokeWidth="1" />
      <line x1="6" y1="7" x2="14" y2="7" stroke="#666" strokeWidth="1" />
      <line x1="6" y1="11" x2="14" y2="11" stroke="#666" strokeWidth="1" />
      <path d="M2 5l3 3-3 3" fill="none" stroke="#5b9bd5" strokeWidth="1.2" />
    </svg>
  ),
  unindent: (
    <svg viewBox="0 0 16 16">
      <line x1="6" y1="3" x2="14" y2="3" stroke="#666" strokeWidth="1" />
      <line x1="6" y1="7" x2="14" y2="7" stroke="#666" strokeWidth="1" />
      <line x1="6" y1="11" x2="14" y2="11" stroke="#666" strokeWidth="1" />
      <path d="M5 5l-3 3 3 3" fill="none" stroke="#5b9bd5" strokeWidth="1.2" />
    </svg>
  ),
  docMap: (
    <svg viewBox="0 0 16 16">
      <rect x="2" y="1" width="8" height="14" fill="none" stroke="#666" strokeWidth="1" />
      <rect x="11" y="1" width="3" height="14" fill="#e0e0e0" stroke="#666" strokeWidth="0.7" />
      <rect x="11.5" y="3" width="2" height="4" fill="#5b9bd5" rx="0.5" />
    </svg>
  ),
  print: (
    <svg viewBox="0 0 16 16">
      <rect x="3" y="6" width="10" height="6" fill="#e0e0e0" stroke="#666" strokeWidth="0.7" rx="1" />
      <rect x="4" y="1" width="8" height="5" fill="#fff" stroke="#666" strokeWidth="0.7" />
      <rect x="4" y="10" width="8" height="5" fill="#fff" stroke="#666" strokeWidth="0.7" />
      <line x1="5" y1="12" x2="11" y2="12" stroke="#666" strokeWidth="0.5" />
    </svg>
  ),
};

// ============================================================
// Language Definitions
// ============================================================
export interface LanguageDef {
  name: string;
  ext: string[];
}

export const LANGUAGES: LanguageDef[] = [
  { name: 'Normal Text', ext: ['txt'] },
  { name: 'JavaScript', ext: ['js', 'mjs', 'cjs'] },
  { name: 'TypeScript', ext: ['ts', 'tsx'] },
  { name: 'JSON', ext: ['json'] },
  { name: 'HTML', ext: ['html', 'htm'] },
  { name: 'XML', ext: ['xml', 'svg'] },
  { name: 'CSS', ext: ['css'] },
  { name: 'Python', ext: ['py'] },
  { name: 'C', ext: ['c', 'h'] },
  { name: 'C++', ext: ['cpp', 'cc', 'cxx', 'hpp'] },
  { name: 'C#', ext: ['cs'] },
  { name: 'Java', ext: ['java'] },
  { name: 'Markdown', ext: ['md', 'markdown'] },
  { name: 'SQL', ext: ['sql'] },
  { name: 'PHP', ext: ['php'] },
  { name: 'Ruby', ext: ['rb'] },
  { name: 'Rust', ext: ['rs'] },
  { name: 'Go', ext: ['go'] },
  { name: 'Shell', ext: ['sh', 'bash', 'zsh'] },
  { name: 'YAML', ext: ['yml', 'yaml'] },
  { name: 'Dockerfile', ext: ['dockerfile'] },
];

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  for (const lang of LANGUAGES) {
    if (lang.ext.includes(ext)) return lang.name;
  }
  return 'Normal Text';
}

export function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'MacPad';
}

export function getLanguageIconColor(langName: string): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f7df1e', 'TypeScript': '#3178c6', 'Python': '#3776ab',
    'HTML': '#e34f26', 'CSS': '#1572b6', 'JSON': '#292929', 'Java': '#ed8b00',
    'C': '#555', 'C++': '#00599c', 'C#': '#239120', 'Go': '#00add8',
    'Rust': '#dea584', 'Ruby': '#cc342d', 'PHP': '#777bb4', 'SQL': '#e38c00',
    'Markdown': '#083fa1', 'XML': '#f60', 'Shell': '#4eaa25', 'YAML': '#cb171e',
    'Dockerfile': '#2496ed',
  };
  return colors[langName] || '#999';
}

// ============================================================
// Menu Structure (without Run, Macro, Tools)
// ============================================================
export const MENU_STRUCTURE: MenuDef[] = [
  {
    label: 'File', id: 'file',
    items: [
      { label: 'New', shortcut: 'Ctrl+N', action: 'newFile' },
      { label: 'Open...', shortcut: 'Ctrl+O', action: 'openFile' },
      { type: 'separator' },
      { label: 'Save', shortcut: 'Ctrl+S', action: 'saveFile' },
      { label: 'Save As...', shortcut: 'Ctrl+Alt+S', action: 'saveFileAs' },
      { label: 'Save All', action: 'saveAll' },
      { type: 'separator' },
      { label: 'Close', shortcut: 'Ctrl+W', action: 'closeTab' },
      { label: 'Close All', action: 'closeAllTabs' },
      { label: 'Close All but Active Document', action: 'closeOtherTabs' },
      { type: 'separator' },
      { label: 'Print...', shortcut: 'Ctrl+P', action: 'print' },
    ],
  },
  {
    label: 'Edit', id: 'edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: 'undo' },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: 'redo' },
      { type: 'separator' },
      { label: 'Cut', shortcut: 'Ctrl+X', action: 'cut' },
      { label: 'Copy', shortcut: 'Ctrl+C', action: 'copy' },
      { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste' },
      { label: 'Delete', shortcut: 'Del', action: 'deleteSelection' },
      { type: 'separator' },
      { label: 'Select All', shortcut: 'Ctrl+A', action: 'selectAll' },
      { type: 'separator' },
      { label: 'Convert to UPPERCASE', shortcut: 'Ctrl+Shift+U', action: 'toUpperCase' },
      { label: 'Convert to lowercase', shortcut: 'Ctrl+U', action: 'toLowerCase' },
      { type: 'separator' },
      { label: 'Sort Lines Ascending', action: 'sortLinesAsc' },
      { label: 'Sort Lines Descending', action: 'sortLinesDesc' },
      { label: 'Remove Duplicate Lines', action: 'removeDuplicateLines' },
      { label: 'Remove Empty Lines', action: 'removeEmptyLines' },
      { label: 'Trim Trailing Whitespace', action: 'trimTrailingWhitespace' },
    ],
  },
  {
    label: 'Search', id: 'search',
    items: [
      { label: 'Find...', shortcut: 'Ctrl+F', action: 'showFind' },
      { label: 'Replace...', shortcut: 'Ctrl+H', action: 'showReplace' },
      { label: 'Find Next', shortcut: 'F3', action: 'findNext' },
      { label: 'Find Previous', shortcut: 'Shift+F3', action: 'findPrev' },
      { type: 'separator' },
      { label: 'Go to Line...', shortcut: 'Ctrl+G', action: 'showGoToLine' },
    ],
  },
  {
    label: 'View', id: 'view',
    items: [
      { label: 'Word Wrap', action: 'toggleWordWrap', checkable: true, checked: false },
      { label: 'Show White Space and TAB', action: 'toggleWhitespace', checkable: true, checked: false },
      { type: 'separator' },
      { label: 'Document Map', action: 'toggleDocumentMap', checkable: true, checked: false },
      { type: 'separator' },
      { label: 'Fold All', action: 'foldAll' },
      { label: 'Unfold All', action: 'unfoldAll' },
      { type: 'separator' },
      { label: 'Zoom In', shortcut: 'Ctrl++', action: 'zoomIn' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', action: 'zoomOut' },
      { label: 'Restore Default Zoom', shortcut: 'Ctrl+0', action: 'zoomReset' },
      { type: 'separator' },
      { label: 'Dark Mode', action: 'toggleDarkMode', checkable: true, checked: false },
    ],
  },
  {
    label: 'Encoding', id: 'encoding',
    items: [
      { label: 'UTF-8', action: 'setEncoding', data: 'UTF-8', checkable: true, checked: true, group: 'encoding' },
      { label: 'UTF-8 with BOM', action: 'setEncoding', data: 'UTF-8-BOM', checkable: true, group: 'encoding' },
      { label: 'UTF-16 LE', action: 'setEncoding', data: 'UTF-16 LE', checkable: true, group: 'encoding' },
      { label: 'UTF-16 BE', action: 'setEncoding', data: 'UTF-16 BE', checkable: true, group: 'encoding' },
      { label: 'ANSI', action: 'setEncoding', data: 'ANSI', checkable: true, group: 'encoding' },
    ],
  },
  {
    label: 'Language', id: 'language',
    items: LANGUAGES.map(lang => ({
      label: lang.name,
      action: 'setLanguage',
      data: lang.name,
      checkable: true,
      checked: lang.name === 'Normal Text',
      group: 'language',
    })),
  },
  {
    label: 'Settings', id: 'settings',
    items: [
      { label: 'Tab Size: 4', action: 'setTabSize', data: '4', checkable: true, checked: true, group: 'tabsize' },
      { label: 'Tab Size: 2', action: 'setTabSize', data: '2', checkable: true, group: 'tabsize' },
      { label: 'Tab Size: 8', action: 'setTabSize', data: '8', checkable: true, group: 'tabsize' },
      { type: 'separator' },
      { label: 'Use Spaces for Tabs', action: 'toggleSpacesForTabs', checkable: true, checked: false },
      { type: 'separator' },
      { label: 'Show Line Numbers', action: 'toggleLineNumbers', checkable: true, checked: true },
      { label: 'Highlight Active Line', action: 'toggleActiveLine', checkable: true, checked: true },
      { label: 'Match Brackets', action: 'toggleMatchBrackets', checkable: true, checked: true },
      { label: 'Auto Close Brackets', action: 'toggleAutoCloseBrackets', checkable: true, checked: true },
      { label: 'Code Folding', action: 'toggleCodeFolding', checkable: true, checked: true },
    ],
  },
  {
    label: '?', id: 'help',
    items: [
      { label: 'About MacPad++', action: 'showAbout' },
      { type: 'separator' },
      { label: 'Download Mac App (Coming Soon)', action: 'download' },
    ],
  },
];

// ============================================================
// Toolbar Items
// ============================================================
export interface ToolbarItemDef {
  type?: 'separator';
  icon?: string;
  action?: string;
  title?: string;
  toggleId?: string;
}

export const TOOLBAR_ITEMS: ToolbarItemDef[] = [
  { icon: 'newFile', action: 'newFile', title: 'New (Ctrl+N)' },
  { icon: 'open', action: 'openFile', title: 'Open (Ctrl+O)' },
  { icon: 'save', action: 'saveFile', title: 'Save (Ctrl+S)' },
  { icon: 'saveAll', action: 'saveAll', title: 'Save All' },
  { icon: 'close', action: 'closeTab', title: 'Close' },
  { type: 'separator' },
  { icon: 'print', action: 'print', title: 'Print (Ctrl+P)' },
  { type: 'separator' },
  { icon: 'cut', action: 'cut', title: 'Cut (Ctrl+X)' },
  { icon: 'copy', action: 'copy', title: 'Copy (Ctrl+C)' },
  { icon: 'paste', action: 'paste', title: 'Paste (Ctrl+V)' },
  { type: 'separator' },
  { icon: 'undo', action: 'undo', title: 'Undo (Ctrl+Z)' },
  { icon: 'redo', action: 'redo', title: 'Redo (Ctrl+Y)' },
  { type: 'separator' },
  { icon: 'find', action: 'showFind', title: 'Find (Ctrl+F)' },
  { icon: 'replace', action: 'showReplace', title: 'Replace (Ctrl+H)' },
  { type: 'separator' },
  { icon: 'zoomIn', action: 'zoomIn', title: 'Zoom In (Ctrl++)' },
  { icon: 'zoomOut', action: 'zoomOut', title: 'Zoom Out (Ctrl+-)' },
  { type: 'separator' },
  { icon: 'wordWrap', action: 'toggleWordWrap', title: 'Word Wrap', toggleId: 'wordWrap' },
  { icon: 'showAll', action: 'toggleWhitespace', title: 'Show All Characters', toggleId: 'showWhitespace' },
  { icon: 'indent', action: 'indent', title: 'Indent (Tab)' },
  { icon: 'unindent', action: 'unindent', title: 'Unindent (Shift+Tab)' },
  { type: 'separator' },
  { icon: 'docMap', action: 'toggleDocumentMap', title: 'Document Map', toggleId: 'documentMap' },
];
