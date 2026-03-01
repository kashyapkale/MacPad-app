import React, { createContext, useContext, useReducer, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { EditorView } from '@codemirror/view';
import { undo, redo, indentMore, indentLess, selectAll } from '@codemirror/commands';
import { SearchCursor } from '@codemirror/search';
import type { AppState, AppAction, AppContextType, Tab, Settings, ContextMenuState, ContextMenuItem } from './types';
import { detectLanguage } from './constants';

// ============================================================
// Default Settings
// ============================================================
export const DEFAULT_SETTINGS: Settings = {
  wordWrap: false,
  showWhitespace: false,
  darkMode: false,
  fontSize: 13,
  tabSize: 4,
  spacesForTabs: false,
  lineNumbers: true,
  activeLine: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  codeFolding: true,
  documentMap: false,
};

// ============================================================
// Initial State
// ============================================================
const INITIAL_STATE: AppState = {
  tabs: [],
  activeTabId: null,
  tabCounter: 0,
  settings: DEFAULT_SETTINGS,
  encoding: 'UTF-8',
};

// ============================================================
// Helper: create a default tab
// ============================================================
function createDefaultTab(counter: number): Tab {
  return {
    id: `tab_${counter}`,
    title: `new ${counter}`,
    content: '',
    language: 'Normal Text',
    modified: false,
    cursorLine: 0,
    cursorCh: 0,
    scrollTop: 0,
  };
}

// ============================================================
// Reducer
// ============================================================
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_TAB': {
      const newCounter = state.tabCounter + 1;
      const tab: Tab = {
        id: `tab_${newCounter}`,
        title: action.payload?.title || `new ${newCounter}`,
        content: action.payload?.content || '',
        language: action.payload?.language || 'Normal Text',
        modified: false,
        cursorLine: 0,
        cursorCh: 0,
        scrollTop: 0,
      };
      return {
        ...state,
        tabCounter: newCounter,
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      };
    }

    case 'CLOSE_TAB': {
      const { id } = action.payload;
      const newTabs = state.tabs.filter(t => t.id !== id);
      if (newTabs.length === 0) {
        const newCounter = state.tabCounter + 1;
        const defaultTab = createDefaultTab(newCounter);
        return { ...state, tabs: [defaultTab], activeTabId: defaultTab.id, tabCounter: newCounter };
      }
      let newActiveId = state.activeTabId;
      if (state.activeTabId === id) {
        const oldIdx = state.tabs.findIndex(t => t.id === id);
        const newIdx = Math.min(oldIdx, newTabs.length - 1);
        newActiveId = newTabs[newIdx].id;
      }
      return { ...state, tabs: newTabs, activeTabId: newActiveId };
    }

    case 'SWITCH_TAB':
      return { ...state, activeTabId: action.payload.id };

    case 'UPDATE_TAB_CONTENT': {
      const tabs = state.tabs.map(t =>
        t.id === action.payload.id ? { ...t, content: action.payload.content } : t
      );
      return { ...state, tabs };
    }

    case 'MARK_MODIFIED': {
      const tabs = state.tabs.map(t =>
        t.id === action.payload.id ? { ...t, modified: action.payload.modified } : t
      );
      return { ...state, tabs };
    }

    case 'SET_TAB_LANGUAGE': {
      const tabs = state.tabs.map(t =>
        t.id === action.payload.id ? { ...t, language: action.payload.language } : t
      );
      return { ...state, tabs };
    }

    case 'RENAME_TAB': {
      const newLang = detectLanguage(action.payload.title);
      const tabs = state.tabs.map(t =>
        t.id === action.payload.id ? { ...t, title: action.payload.title, language: newLang } : t
      );
      return { ...state, tabs };
    }

    case 'UPDATE_TAB_CURSOR': {
      const tabs = state.tabs.map(t =>
        t.id === action.payload.id ? { ...t, cursorLine: action.payload.line, cursorCh: action.payload.ch } : t
      );
      return { ...state, tabs };
    }

    case 'UPDATE_TAB_SCROLL': {
      const tabs = state.tabs.map(t =>
        t.id === action.payload.id ? { ...t, scrollTop: action.payload.scrollTop } : t
      );
      return { ...state, tabs };
    }

    case 'CLOSE_ALL_TABS': {
      const newCounter = state.tabCounter + 1;
      const defaultTab = createDefaultTab(newCounter);
      return { ...state, tabs: [defaultTab], activeTabId: defaultTab.id, tabCounter: newCounter };
    }

    case 'CLOSE_OTHER_TABS': {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (!activeTab) {
        const newCounter = state.tabCounter + 1;
        const defaultTab = createDefaultTab(newCounter);
        return { ...state, tabs: [defaultTab], activeTabId: defaultTab.id, tabCounter: newCounter };
      }
      return { ...state, tabs: [activeTab] };
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'SET_ENCODING':
      return { ...state, encoding: action.payload };

    case 'RESTORE_STATE':
      return { ...action.payload };

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================
const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ============================================================
// Storage
// ============================================================
const STORAGE_KEY = 'macpad_state';

function saveToStorage(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

function loadFromStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load state:', e);
    return null;
  }
}

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load initial state from localStorage
  const initialState = useMemo(() => {
    const saved = loadFromStorage();
    if (saved && saved.tabs && saved.tabs.length > 0) {
      return {
        ...INITIAL_STATE,
        ...saved,
        settings: { ...DEFAULT_SETTINGS, ...saved.settings },
      };
    }
    // Create a default tab
    const defaultTab = createDefaultTab(1);
    return { ...INITIAL_STATE, tabs: [defaultTab], activeTabId: defaultTab.id, tabCounter: 1 };
  }, []);

  const [state, dispatch] = useReducer(appReducer, initialState);
  const editorViewRef = useRef<EditorView | null>(null);

  // UI state
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [findReplaceMode, setFindReplaceMode] = useState<'find' | 'replace'>('find');
  const [goToLineOpen, setGoToLineOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Auto-save to localStorage
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveToStorage(state), 300);
  }, [state]);

  // Active tab helper
  const activeTab = useMemo(() => {
    return state.tabs.find(t => t.id === state.activeTabId) || null;
  }, [state.tabs, state.activeTabId]);

  // Dialog functions
  const openFindReplace = useCallback((mode: 'find' | 'replace') => {
    setFindReplaceMode(mode);
    setFindReplaceOpen(true);
  }, []);
  const closeFindReplace = useCallback(() => setFindReplaceOpen(false), []);
  const openGoToLine = useCallback(() => setGoToLineOpen(true), []);
  const closeGoToLine = useCallback(() => setGoToLineOpen(false), []);
  const openAbout = useCallback(() => setAboutOpen(true), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);

  const showContextMenu = useCallback((x: number, y: number, items: (ContextMenuItem | { type: 'separator' })[]) => {
    setContextMenu({ x, y, items });
  }, []);
  const hideContextMenu = useCallback(() => setContextMenu(null), []);

  // ============================================================
  // Unified action handler
  // ============================================================
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAction = useCallback((action: string, data?: string | number) => {
    const view = editorViewRef.current;

    switch (action) {
      // File actions
      case 'newFile':
        dispatch({ type: 'CREATE_TAB' });
        break;
      case 'openFile':
        fileInputRef.current?.click();
        break;
      case 'saveFile': {
        if (!activeTab) break;
        const content = view ? view.state.doc.toString() : activeTab.content;
        const filename = activeTab.title.startsWith('new ') ? activeTab.title + '.txt' : activeTab.title;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        dispatch({ type: 'MARK_MODIFIED', payload: { id: activeTab.id, modified: false } });
        break;
      }
      case 'saveFileAs': {
        if (!activeTab) break;
        const name = prompt('Save file as:', activeTab.title);
        if (!name) break;
        const content2 = view ? view.state.doc.toString() : activeTab.content;
        dispatch({ type: 'RENAME_TAB', payload: { id: activeTab.id, title: name } });
        dispatch({ type: 'MARK_MODIFIED', payload: { id: activeTab.id, modified: false } });
        const blob2 = new Blob([content2], { type: 'text/plain;charset=utf-8' });
        const url2 = URL.createObjectURL(blob2);
        const a2 = document.createElement('a');
        a2.href = url2;
        a2.download = name;
        a2.click();
        URL.revokeObjectURL(url2);
        break;
      }
      case 'saveAll':
        if (activeTab && view) {
          dispatch({ type: 'UPDATE_TAB_CONTENT', payload: { id: activeTab.id, content: view.state.doc.toString() } });
        }
        break;
      case 'closeTab':
        if (state.activeTabId) {
          dispatch({ type: 'CLOSE_TAB', payload: { id: state.activeTabId } });
        }
        break;
      case 'closeAllTabs':
        dispatch({ type: 'CLOSE_ALL_TABS' });
        break;
      case 'closeOtherTabs':
        dispatch({ type: 'CLOSE_OTHER_TABS' });
        break;
      case 'print':
        window.print();
        break;

      // Edit actions
      case 'undo':
        if (view) undo(view);
        break;
      case 'redo':
        if (view) redo(view);
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        navigator.clipboard.readText().then(text => {
          if (view) {
            view.dispatch(view.state.replaceSelection(text));
          }
        }).catch(() => document.execCommand('paste'));
        break;
      case 'deleteSelection':
        if (view) view.dispatch(view.state.replaceSelection(''));
        break;
      case 'selectAll':
        if (view) selectAll(view);
        break;
      case 'indent':
        if (view) indentMore(view);
        break;
      case 'unindent':
        if (view) indentLess(view);
        break;
      case 'toUpperCase':
        if (view) {
          const sel = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to);
          if (sel) view.dispatch(view.state.replaceSelection(sel.toUpperCase()));
        }
        break;
      case 'toLowerCase':
        if (view) {
          const sel = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to);
          if (sel) view.dispatch(view.state.replaceSelection(sel.toLowerCase()));
        }
        break;
      case 'sortLinesAsc':
      case 'sortLinesDesc':
        if (view) {
          const doc = view.state.doc.toString();
          const lines = doc.split('\n');
          lines.sort((a, b) => action === 'sortLinesAsc' ? a.localeCompare(b) : b.localeCompare(a));
          view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: lines.join('\n') } });
        }
        break;
      case 'removeDuplicateLines':
        if (view) {
          const doc = view.state.doc.toString();
          const unique = [...new Set(doc.split('\n'))];
          view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: unique.join('\n') } });
        }
        break;
      case 'removeEmptyLines':
        if (view) {
          const doc = view.state.doc.toString();
          const filtered = doc.split('\n').filter(l => l.trim().length > 0);
          view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: filtered.join('\n') } });
        }
        break;
      case 'trimTrailingWhitespace':
        if (view) {
          const doc = view.state.doc.toString();
          const trimmed = doc.split('\n').map(l => l.replace(/\s+$/, ''));
          view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: trimmed.join('\n') } });
        }
        break;

      // Search actions
      case 'showFind':
        openFindReplace('find');
        break;
      case 'showReplace':
        openFindReplace('replace');
        break;
      case 'showGoToLine':
        openGoToLine();
        break;

      // View actions
      case 'toggleWordWrap':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { wordWrap: !state.settings.wordWrap } });
        break;
      case 'toggleWhitespace':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { showWhitespace: !state.settings.showWhitespace } });
        break;
      case 'toggleDocumentMap':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { documentMap: !state.settings.documentMap } });
        break;
      case 'foldAll':
        // Handled in Editor component
        if (view) {
          const foldAll = (view as unknown as Record<string, unknown>).__foldAll as (() => void) | undefined;
          if (foldAll) foldAll();
        }
        break;
      case 'unfoldAll':
        if (view) {
          const unfoldAll = (view as unknown as Record<string, unknown>).__unfoldAll as (() => void) | undefined;
          if (unfoldAll) unfoldAll();
        }
        break;
      case 'zoomIn':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { fontSize: Math.min(40, state.settings.fontSize + 1) } });
        break;
      case 'zoomOut':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { fontSize: Math.max(6, state.settings.fontSize - 1) } });
        break;
      case 'zoomReset':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { fontSize: 13 } });
        break;
      case 'toggleDarkMode':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { darkMode: !state.settings.darkMode } });
        break;

      // Encoding
      case 'setEncoding':
        if (typeof data === 'string') dispatch({ type: 'SET_ENCODING', payload: data });
        break;

      // Language
      case 'setLanguage':
        if (activeTab && typeof data === 'string') {
          dispatch({ type: 'SET_TAB_LANGUAGE', payload: { id: activeTab.id, language: data } });
        }
        break;

      // Settings
      case 'setTabSize':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { tabSize: Number(data) } });
        break;
      case 'toggleSpacesForTabs':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { spacesForTabs: !state.settings.spacesForTabs } });
        break;
      case 'toggleLineNumbers':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { lineNumbers: !state.settings.lineNumbers } });
        break;
      case 'toggleActiveLine':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { activeLine: !state.settings.activeLine } });
        break;
      case 'toggleMatchBrackets':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { matchBrackets: !state.settings.matchBrackets } });
        break;
      case 'toggleAutoCloseBrackets':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { autoCloseBrackets: !state.settings.autoCloseBrackets } });
        break;
      case 'toggleCodeFolding':
        dispatch({ type: 'UPDATE_SETTINGS', payload: { codeFolding: !state.settings.codeFolding } });
        break;

      // Help
      case 'showAbout':
        openAbout();
        break;
      case 'download':
        alert('Mac App download coming soon! Stay tuned.');
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, activeTab, openFindReplace, openGoToLine, openAbout]);

  const value = useMemo<AppContextType>(() => ({
    state,
    dispatch,
    editorViewRef,
    findReplaceOpen,
    findReplaceMode,
    openFindReplace,
    closeFindReplace,
    goToLineOpen,
    openGoToLine,
    closeGoToLine,
    aboutOpen,
    openAbout,
    closeAbout,
    contextMenu,
    showContextMenu,
    hideContextMenu,
    activeTab,
    handleAction,
  }), [
    state, findReplaceOpen, findReplaceMode, goToLineOpen, aboutOpen, contextMenu,
    activeTab, handleAction, openFindReplace, closeFindReplace, openGoToLine, closeGoToLine,
    openAbout, closeAbout, showContextMenu, hideContextMenu,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* Hidden file input for Open */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach(file => {
              const reader = new FileReader();
              reader.onload = (ev) => {
                const content = ev.target?.result as string;
                const lang = detectLanguage(file.name);
                dispatch({ type: 'CREATE_TAB', payload: { title: file.name, content, language: lang } });
              };
              reader.readAsText(file);
            });
          }
          e.target.value = '';
        }}
      />
    </AppContext.Provider>
  );
}
