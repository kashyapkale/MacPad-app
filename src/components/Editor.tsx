import { useEffect, useRef, useMemo, useCallback } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { search } from '@codemirror/search';
import { foldAll, unfoldAll } from '@codemirror/language';
import { useApp } from '../store';

function getLanguageExtension(langName: string) {
  switch (langName) {
    case 'JavaScript': return javascript();
    case 'TypeScript': return javascript({ typescript: true });
    case 'JSON': return json();
    case 'HTML': return html();
    case 'XML': return xml();
    case 'CSS': return css();
    case 'Python': return python();
    case 'C':
    case 'C++':
    case 'C#':
    case 'Objective-C':
      return cpp();
    case 'Java': return java();
    case 'Markdown': return markdown();
    case 'SQL': return sql();
    case 'PHP': return php();
    case 'Rust': return rust();
    case 'YAML': return yaml();
    default: return [];
  }
}

export default function Editor() {
  const { state, dispatch, editorViewRef, activeTab, showContextMenu } = useApp();
  const cmRef = useRef<ReactCodeMirrorRef>(null);
  const prevTabIdRef = useRef<string | null>(null);
  const isTabSwitchRef = useRef(false);

  const { settings } = state;

  // Build extensions based on settings and language
  const extensions = useMemo(() => {
    const exts = [];

    // Language
    if (activeTab) {
      const langExt = getLanguageExtension(activeTab.language);
      if (langExt) exts.push(langExt);
    }

    // Word wrap
    if (settings.wordWrap) {
      exts.push(EditorView.lineWrapping);
    }

    // Search (for highlighting, we use the built-in search infrastructure)
    exts.push(search({ top: true }));

    // Context menu handler
    exts.push(EditorView.domEventHandlers({
      contextmenu: (e, view) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, [
          { label: 'Undo', shortcut: 'Ctrl+Z', action: 'undo' },
          { label: 'Redo', shortcut: 'Ctrl+Y', action: 'redo' },
          { type: 'separator' as const },
          { label: 'Cut', shortcut: 'Ctrl+X', action: 'cut' },
          { label: 'Copy', shortcut: 'Ctrl+C', action: 'copy' },
          { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste' },
          { label: 'Delete', action: 'deleteSelection' },
          { type: 'separator' as const },
          { label: 'Select All', shortcut: 'Ctrl+A', action: 'selectAll' },
          { type: 'separator' as const },
          { label: 'UPPERCASE', shortcut: 'Ctrl+Shift+U', action: 'toUpperCase' },
          { label: 'lowercase', shortcut: 'Ctrl+U', action: 'toLowerCase' },
        ]);
        return true;
      },
    }));

    return exts;
  }, [activeTab?.language, settings.wordWrap, showContextMenu]);

  // Store editor view ref when created
  const handleCreateEditor = useCallback((view: EditorView) => {
    editorViewRef.current = view;

    // Attach fold helpers for menu actions
    (view as unknown as Record<string, unknown>).__foldAll = () => foldAll(view);
    (view as unknown as Record<string, unknown>).__unfoldAll = () => unfoldAll(view);
  }, [editorViewRef]);

  // Save cursor/scroll before tab switch
  useEffect(() => {
    if (prevTabIdRef.current && prevTabIdRef.current !== state.activeTabId) {
      const view = editorViewRef.current;
      if (view) {
        const cursor = view.state.selection.main;
        const line = view.state.doc.lineAt(cursor.head);
        dispatch({
          type: 'UPDATE_TAB_CURSOR',
          payload: {
            id: prevTabIdRef.current,
            line: line.number - 1,
            ch: cursor.head - line.from,
          },
        });
        dispatch({
          type: 'UPDATE_TAB_SCROLL',
          payload: {
            id: prevTabIdRef.current,
            scrollTop: view.scrollDOM.scrollTop,
          },
        });
      }
      isTabSwitchRef.current = true;
    }
    prevTabIdRef.current = state.activeTabId;
  }, [state.activeTabId, dispatch, editorViewRef]);

  // Restore cursor/scroll after tab switch
  useEffect(() => {
    if (isTabSwitchRef.current && activeTab && editorViewRef.current) {
      const view = editorViewRef.current;
      // Need a small delay for content to be set
      requestAnimationFrame(() => {
        try {
          const lineNum = Math.min(activeTab.cursorLine + 1, view.state.doc.lines);
          const line = view.state.doc.line(lineNum);
          const ch = Math.min(activeTab.cursorCh, line.length);
          const pos = line.from + ch;
          view.dispatch({
            selection: { anchor: pos, head: pos },
            scrollIntoView: false,
          });
          view.scrollDOM.scrollTop = activeTab.scrollTop || 0;
        } catch {
          // Ignore cursor restoration errors
        }
        view.focus();
        isTabSwitchRef.current = false;
      });
    }
  }, [activeTab?.id]);

  // Handle content changes
  const handleChange = useCallback((value: string) => {
    if (!activeTab || isTabSwitchRef.current) return;
    dispatch({ type: 'UPDATE_TAB_CONTENT', payload: { id: activeTab.id, content: value } });
    if (!activeTab.modified) {
      dispatch({ type: 'MARK_MODIFIED', payload: { id: activeTab.id, modified: true } });
    }
  }, [activeTab, dispatch]);

  if (!activeTab) return <div className="editor-container" />;

  return (
    <div className="editor-container" style={{ fontSize: settings.fontSize + 'px' }}>
      <CodeMirror
        ref={cmRef}
        value={activeTab.content}
        height="100%"
        theme={settings.darkMode ? oneDark : 'light'}
        extensions={extensions}
        onChange={handleChange}
        onCreateEditor={handleCreateEditor}
        basicSetup={{
          lineNumbers: settings.lineNumbers,
          highlightActiveLineGutter: settings.activeLine,
          highlightActiveLine: settings.activeLine,
          bracketMatching: settings.matchBrackets,
          closeBrackets: settings.autoCloseBrackets,
          foldGutter: settings.codeFolding,
          tabSize: settings.tabSize,
          indentOnInput: true,
          autocompletion: false,
          searchKeymap: false,
        }}
      />
    </div>
  );
}
