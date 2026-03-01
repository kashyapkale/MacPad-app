import { useState, useRef, useCallback, useEffect } from 'react';
import { SearchCursor } from '@codemirror/search';
import { useApp } from '../store';

export default function FindReplaceDialog() {
  const { findReplaceOpen, findReplaceMode, closeFindReplace, editorViewRef } = useApp();
  const [activeMode, setActiveMode] = useState<'find' | 'replace'>(findReplaceMode);
  const [query, setQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [wrapAround, setWrapAround] = useState(true);
  const [useRegex, setUseRegex] = useState(false);
  const [statusText, setStatusText] = useState('');

  const findInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Sync mode from prop
  useEffect(() => {
    setActiveMode(findReplaceMode);
  }, [findReplaceMode]);

  // Focus and pre-fill on open
  useEffect(() => {
    if (findReplaceOpen && findInputRef.current) {
      // Pre-fill with selection
      const view = editorViewRef.current;
      if (view) {
        const sel = view.state.sliceDoc(
          view.state.selection.main.from,
          view.state.selection.main.to
        );
        if (sel && !sel.includes('\n')) {
          setQuery(sel);
        }
      }
      setTimeout(() => {
        findInputRef.current?.focus();
        findInputRef.current?.select();
      }, 50);
    }
  }, [findReplaceOpen, editorViewRef]);

  // Make dialog draggable
  useEffect(() => {
    const dialog = dialogRef.current;
    const handle = titleRef.current;
    if (!dialog || !handle) return;

    let isDragging = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.win-dialog-close')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = dialog.getBoundingClientRect();
      origLeft = rect.left;
      origTop = rect.top;
      dialog.style.transform = 'none';
      dialog.style.left = origLeft + 'px';
      dialog.style.top = origTop + 'px';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      dialog.style.left = (origLeft + e.clientX - startX) + 'px';
      dialog.style.top = (origTop + e.clientY - startY) + 'px';
    };

    const onMouseUp = () => { isDragging = false; };

    handle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [findReplaceOpen]);

  const buildSearchRegex = useCallback((): RegExp | null => {
    if (!query) return null;
    try {
      if (useRegex) {
        return new RegExp(query, matchCase ? 'g' : 'gi');
      }
      let escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (wholeWord) escaped = '\\b' + escaped + '\\b';
      return new RegExp(escaped, matchCase ? 'g' : 'gi');
    } catch {
      setStatusText('Invalid regex');
      return null;
    }
  }, [query, matchCase, wholeWord, useRegex]);

  const countMatches = useCallback((): number => {
    const view = editorViewRef.current;
    if (!view || !query) return 0;
    const regex = buildSearchRegex();
    if (!regex) return 0;
    const content = view.state.doc.toString();
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  }, [editorViewRef, query, buildSearchRegex]);

  const doSearch = useCallback((forward: boolean) => {
    const view = editorViewRef.current;
    if (!view || !query) {
      setStatusText('');
      return;
    }

    const count = countMatches();
    const doc = view.state.doc.toString();
    const cursor = view.state.selection.main;
    const startPos = forward ? cursor.to : cursor.from;

    // Use SearchCursor for navigation
    const searchCursor = new SearchCursor(
      view.state.doc,
      query,
      forward ? startPos : 0,
      undefined,
      matchCase ? undefined : (s: string) => s.toLowerCase()
    );

    if (forward) {
      const result = searchCursor.next();
      if (!result.done) {
        view.dispatch({
          selection: { anchor: result.value.from, head: result.value.to },
          scrollIntoView: true,
        });
        setStatusText(`${count} match(es) found`);
        return;
      }
      // Wrap around
      if (wrapAround) {
        const wrapCursor = new SearchCursor(
          view.state.doc,
          query,
          0,
          undefined,
          matchCase ? undefined : (s: string) => s.toLowerCase()
        );
        const wResult = wrapCursor.next();
        if (!wResult.done) {
          view.dispatch({
            selection: { anchor: wResult.value.from, head: wResult.value.to },
            scrollIntoView: true,
          });
          setStatusText(`${count} match(es) found (wrapped)`);
          return;
        }
      }
    } else {
      // Search backwards: find all matches before current position
      const allCursor = new SearchCursor(
        view.state.doc,
        query,
        0,
        undefined,
        matchCase ? undefined : (s: string) => s.toLowerCase()
      );
      let lastBefore: { from: number; to: number } | null = null;
      let lastMatch: { from: number; to: number } | null = null;

      let result = allCursor.next();
      while (!result.done) {
        lastMatch = { from: result.value.from, to: result.value.to };
        if (result.value.from < startPos) {
          lastBefore = { from: result.value.from, to: result.value.to };
        }
        result = allCursor.next();
      }

      if (lastBefore) {
        view.dispatch({
          selection: { anchor: lastBefore.from, head: lastBefore.to },
          scrollIntoView: true,
        });
        setStatusText(`${count} match(es) found`);
        return;
      }
      if (wrapAround && lastMatch) {
        view.dispatch({
          selection: { anchor: lastMatch.from, head: lastMatch.to },
          scrollIntoView: true,
        });
        setStatusText(`${count} match(es) found (wrapped)`);
        return;
      }
    }

    setStatusText(count > 0 ? `${count} match(es) (no more in this direction)` : 'No matches found');
  }, [editorViewRef, query, matchCase, wrapAround, countMatches]);

  const doReplace = useCallback(() => {
    const view = editorViewRef.current;
    if (!view || !query) return;
    const sel = view.state.selection.main;
    if (sel.from !== sel.to) {
      view.dispatch({
        changes: { from: sel.from, to: sel.to, insert: replaceText },
      });
    }
    doSearch(true);
  }, [editorViewRef, query, replaceText, doSearch]);

  const doReplaceAll = useCallback(() => {
    const view = editorViewRef.current;
    if (!view || !query) return;
    const regex = buildSearchRegex();
    if (!regex) return;
    const content = view.state.doc.toString();
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    const newContent = content.replace(regex, replaceText);
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: newContent } });
    setStatusText(`${count} replacement(s) made`);
  }, [editorViewRef, query, replaceText, buildSearchRegex]);

  const doCount = useCallback(() => {
    const count = countMatches();
    setStatusText(`Count: ${count} match(es)`);
  }, [countMatches]);

  if (!findReplaceOpen) return null;

  return (
    <div className="dialog-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeFindReplace(); }}>
      <div className="win-dialog" ref={dialogRef}>
        <div className="win-dialog-titlebar" ref={titleRef}>
          <span>Find and Replace</span>
          <button className="win-dialog-close" onClick={closeFindReplace}>✕</button>
        </div>
        <div className="win-dialog-body">
          <div className="win-dialog-tabs">
            <button
              className={`win-dialog-tab ${activeMode === 'find' ? 'active' : ''}`}
              onClick={() => setActiveMode('find')}
            >
              Find
            </button>
            <button
              className={`win-dialog-tab ${activeMode === 'replace' ? 'active' : ''}`}
              onClick={() => setActiveMode('replace')}
            >
              Replace
            </button>
          </div>

          <div className="dialog-row">
            <label>Find what :</label>
            <input
              ref={findInputRef}
              type="text"
              className="win-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') doSearch(true); }}
              autoComplete="off"
            />
          </div>

          {activeMode === 'replace' && (
            <div className="dialog-row">
              <label>Replace with :</label>
              <input
                type="text"
                className="win-input"
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') doReplace(); }}
                autoComplete="off"
              />
            </div>
          )}

          <div className="dialog-options">
            <label className="win-checkbox">
              <input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} />
              Match case
            </label>
            <label className="win-checkbox">
              <input type="checkbox" checked={wholeWord} onChange={e => setWholeWord(e.target.checked)} />
              Whole word
            </label>
            <label className="win-checkbox">
              <input type="checkbox" checked={wrapAround} onChange={e => setWrapAround(e.target.checked)} />
              Wrap around
            </label>
            <label className="win-checkbox">
              <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} />
              Regular expression
            </label>
          </div>

          <div className="dialog-buttons">
            <button className="win-btn" onClick={() => doSearch(true)}>Find Next</button>
            <button className="win-btn" onClick={() => doSearch(false)}>Find Previous</button>
            {activeMode === 'replace' && (
              <>
                <button className="win-btn" onClick={doReplace}>Replace</button>
                <button className="win-btn" onClick={doReplaceAll}>Replace All</button>
              </>
            )}
            <button className="win-btn" onClick={doCount}>Count</button>
            <button className="win-btn" onClick={closeFindReplace}>Close</button>
          </div>

          <div className="find-status">{statusText}</div>
        </div>
      </div>
    </div>
  );
}
