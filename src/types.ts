import type { EditorView } from '@codemirror/view';

export interface Tab {
  id: string;
  title: string;
  content: string;
  language: string;
  modified: boolean;
  cursorLine: number;
  cursorCh: number;
  scrollTop: number;
}

export interface Settings {
  wordWrap: boolean;
  showWhitespace: boolean;
  darkMode: boolean;
  fontSize: number;
  tabSize: number;
  spacesForTabs: boolean;
  lineNumbers: boolean;
  activeLine: boolean;
  matchBrackets: boolean;
  autoCloseBrackets: boolean;
  codeFolding: boolean;
  documentMap: boolean;
}

export interface AppState {
  tabs: Tab[];
  activeTabId: string | null;
  tabCounter: number;
  settings: Settings;
  encoding: string;
}

export interface ContextMenuItem {
  label: string;
  shortcut?: string;
  action: string | (() => void);
  disabled?: boolean;
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: (ContextMenuItem | { type: 'separator' })[];
}

export interface MenuActionItem {
  label: string;
  shortcut?: string;
  action?: string;
  data?: string | number;
  checkable?: boolean;
  checked?: boolean;
  group?: string;
  disabled?: boolean;
  type?: undefined;
}

export interface MenuSeparator {
  type: 'separator';
}

export type MenuItemDef = MenuActionItem | MenuSeparator;

export interface MenuDef {
  label: string;
  id: string;
  items: MenuItemDef[];
}

export type AppAction =
  | { type: 'CREATE_TAB'; payload?: { title?: string; content?: string; language?: string } }
  | { type: 'CLOSE_TAB'; payload: { id: string } }
  | { type: 'SWITCH_TAB'; payload: { id: string } }
  | { type: 'UPDATE_TAB_CONTENT'; payload: { id: string; content: string } }
  | { type: 'MARK_MODIFIED'; payload: { id: string; modified: boolean } }
  | { type: 'SET_TAB_LANGUAGE'; payload: { id: string; language: string } }
  | { type: 'RENAME_TAB'; payload: { id: string; title: string } }
  | { type: 'UPDATE_TAB_CURSOR'; payload: { id: string; line: number; ch: number } }
  | { type: 'UPDATE_TAB_SCROLL'; payload: { id: string; scrollTop: number } }
  | { type: 'CLOSE_ALL_TABS' }
  | { type: 'CLOSE_OTHER_TABS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_ENCODING'; payload: string }
  | { type: 'RESTORE_STATE'; payload: AppState };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  editorViewRef: React.MutableRefObject<EditorView | null>;

  // UI state
  findReplaceOpen: boolean;
  findReplaceMode: 'find' | 'replace';
  openFindReplace: (mode: 'find' | 'replace') => void;
  closeFindReplace: () => void;

  goToLineOpen: boolean;
  openGoToLine: () => void;
  closeGoToLine: () => void;

  aboutOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;

  contextMenu: ContextMenuState | null;
  showContextMenu: (x: number, y: number, items: (ContextMenuItem | { type: 'separator' })[]) => void;
  hideContextMenu: () => void;

  // Convenience
  activeTab: Tab | null;
  handleAction: (action: string, data?: string | number) => void;
}
