import { useState, useEffect } from 'react';
import { useApp } from '../store';
import { getBrowserName } from '../constants';

export default function StatusBar() {
  const { state, activeTab, editorViewRef } = useApp();
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1, sel: 0, selLines: 0 });
  const [docInfo, setDocInfo] = useState({ length: 0, lines: 1 });

  const browserName = getBrowserName();

  // Poll cursor info from editor view
  useEffect(() => {
    const interval = setInterval(() => {
      const view = editorViewRef.current;
      if (!view) return;

      const mainSel = view.state.selection.main;
      const line = view.state.doc.lineAt(mainSel.head);
      const col = mainSel.head - line.from;
      const selText = view.state.sliceDoc(mainSel.from, mainSel.to);
      const selLines = selText.length > 0 ? selText.split('\n').length : 0;

      setCursorInfo({
        line: line.number,
        col: col + 1,
        sel: selText.length,
        selLines,
      });

      setDocInfo({
        length: view.state.doc.length,
        lines: view.state.doc.lines,
      });
    }, 100);

    return () => clearInterval(interval);
  }, [editorViewRef]);

  return (
    <div className="status-bar">
      <div className="status-section status-doctype">
        {activeTab?.language || 'Normal Text'}
      </div>
      <div className="status-section status-length">
        length : {docInfo.length}
      </div>
      <div className="status-section status-lines">
        lines : {docInfo.lines}
      </div>
      <div className="status-section status-position">
        Ln : {cursorInfo.line} &nbsp;&nbsp; Col : {cursorInfo.col} &nbsp;&nbsp; Sel : {cursorInfo.sel} | {cursorInfo.selLines}
      </div>
      <div className="status-section status-encoding">
        {state.encoding}
      </div>
      <div className="status-section status-eol">
        {browserName}
      </div>
      <div className="status-section status-insert">
        INS
      </div>
    </div>
  );
}
