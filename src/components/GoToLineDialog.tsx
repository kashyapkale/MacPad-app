import { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';

export default function GoToLineDialog() {
  const { goToLineOpen, closeGoToLine, editorViewRef } = useApp();
  const [lineNum, setLineNum] = useState('');
  const [currentLine, setCurrentLine] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (goToLineOpen) {
      const view = editorViewRef.current;
      if (view) {
        const line = view.state.doc.lineAt(view.state.selection.main.head);
        setCurrentLine(line.number);
      }
      setLineNum('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [goToLineOpen, editorViewRef]);

  const handleGo = () => {
    const view = editorViewRef.current;
    if (!view) return;
    const num = parseInt(lineNum);
    if (isNaN(num) || num < 1) return;
    const targetLine = Math.min(num, view.state.doc.lines);
    const line = view.state.doc.line(targetLine);
    view.dispatch({
      selection: { anchor: line.from, head: line.from },
      scrollIntoView: true,
    });
    view.focus();
    closeGoToLine();
  };

  if (!goToLineOpen) return null;

  return (
    <div className="dialog-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeGoToLine(); }}>
      <div className="win-dialog small-dialog">
        <div className="win-dialog-titlebar">
          <span>Go To Line</span>
          <button className="win-dialog-close" onClick={closeGoToLine}>✕</button>
        </div>
        <div className="win-dialog-body">
          <div className="dialog-row">
            <label>You are here :</label>
            <span>{currentLine}</span>
          </div>
          <div className="dialog-row">
            <label>You want to go to :</label>
            <input
              ref={inputRef}
              type="number"
              className="win-input"
              min={1}
              value={lineNum}
              onChange={e => setLineNum(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleGo(); }}
            />
          </div>
          <div className="dialog-buttons">
            <button className="win-btn" onClick={handleGo}>Go</button>
            <button className="win-btn" onClick={closeGoToLine}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
