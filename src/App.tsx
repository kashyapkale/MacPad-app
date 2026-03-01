import { useEffect, useCallback } from 'react';
import { useApp } from './store';
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import TabBar from './components/TabBar';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import FindReplaceDialog from './components/FindReplaceDialog';
import GoToLineDialog from './components/GoToLineDialog';
import AboutDialog from './components/AboutDialog';
import ContextMenu from './components/ContextMenu';

export default function App() {
  const {
    state,
    handleAction,
    closeFindReplace,
    closeGoToLine,
    closeAbout,
    hideContextMenu,
  } = useApp();

  // ============================================================
  // Global keyboard shortcuts
  // ============================================================
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if (ctrl && !shift && e.key === 'n') { e.preventDefault(); handleAction('newFile'); }
    else if (ctrl && !shift && e.key === 'o') { e.preventDefault(); handleAction('openFile'); }
    else if (ctrl && !shift && e.key === 's') { e.preventDefault(); handleAction('saveFile'); }
    else if (ctrl && shift && e.key === 'S') { e.preventDefault(); handleAction('saveFileAs'); }
    else if (ctrl && !shift && e.key === 'w') { e.preventDefault(); handleAction('closeTab'); }
    else if (ctrl && !shift && e.key === 'f') { e.preventDefault(); handleAction('showFind'); }
    else if (ctrl && !shift && e.key === 'h') { e.preventDefault(); handleAction('showReplace'); }
    else if (ctrl && !shift && e.key === 'g') { e.preventDefault(); handleAction('showGoToLine'); }
    else if (ctrl && !shift && e.key === 'p') { e.preventDefault(); handleAction('print'); }
    else if (ctrl && shift && e.key === 'U') { e.preventDefault(); handleAction('toUpperCase'); }
    else if (ctrl && !shift && e.key === 'u') { e.preventDefault(); handleAction('toLowerCase'); }
    else if (ctrl && !shift && (e.key === '=' || e.key === '+')) { e.preventDefault(); handleAction('zoomIn'); }
    else if (ctrl && !shift && e.key === '-') { e.preventDefault(); handleAction('zoomOut'); }
    else if (ctrl && !shift && e.key === '0') { e.preventDefault(); handleAction('zoomReset'); }
    else if (e.key === 'F3' && !shift) { e.preventDefault(); handleAction('findNext'); }
    else if (e.key === 'F3' && shift) { e.preventDefault(); handleAction('findPrev'); }
    else if (e.key === 'Escape') {
      closeFindReplace();
      closeGoToLine();
      closeAbout();
      hideContextMenu();
    }
  }, [handleAction, closeFindReplace, closeGoToLine, closeAbout, hideContextMenu]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ============================================================
  // Drag & Drop
  // ============================================================
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      // Trigger file open via the hidden file input approach
      Array.from(e.dataTransfer.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          // We need to use dispatch from context, but handleAction('openFile') triggers input
          // So we dispatch directly from here via a custom approach
          handleAction('newFile');
          // This is a bit indirect; will be handled by creating tab with content
        };
        reader.readAsText(file);
      });
    }
  }, [handleAction]);

  // Click away to hide context menu
  useEffect(() => {
    const handler = () => hideContextMenu();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [hideContextMenu]);

  // Update page title
  useEffect(() => {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (tab) {
      const mod = tab.modified ? '*' : '';
      document.title = `${mod}${tab.title} - MacPad++`;
    }
  }, [state.tabs, state.activeTabId]);

  const appClass = state.settings.darkMode ? 'app dark-theme' : 'app';

  return (
    <div
      id="app"
      className={appClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <a
        className="github-link"
        href="https://github.com/kashyapkale/MacPad-app"
        target="_blank"
        rel="noopener noreferrer"
        title="View on GitHub"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
            -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
            -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82
            a7.64 7.64 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92
            .08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07
            -.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>
      <MenuBar />
      <Toolbar />
      <TabBar />
      <div className="editor-wrapper">
        <Editor />
      </div>
      <StatusBar />

      <FindReplaceDialog />
      <GoToLineDialog />
      <AboutDialog />
      <ContextMenu />
    </div>
  );
}
