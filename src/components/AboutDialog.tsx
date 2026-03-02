import { useApp } from '../store';

export default function AboutDialog() {
  const { aboutOpen, closeAbout } = useApp();

  if (!aboutOpen) return null;

  return (
    <div className="dialog-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeAbout(); }}>
      <div className="win-dialog about-dialog">
        <div className="win-dialog-titlebar">
          <span>About MacPad++</span>
          <button className="win-dialog-close" onClick={closeAbout}>✕</button>
        </div>
        <div className="win-dialog-body about-body">
          <div className="about-icon">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="8" fill="#90EE90" />
              <text x="8" y="48" fontSize="42" fontFamily="monospace" fontWeight="bold" fill="#006400">M+</text>
            </svg>
          </div>
          <h2>MacPad++ v1.0</h2>
          <p>A fast, lightweight code editor for the web &amp; macOS</p>
          <p className="about-sub">Built with React + CodeMirror &bull; Stores locally in your browser</p>
          <button className="download-link" onClick={() => alert('Mac App download coming soon!')}>
            Download Mac App (Coming Soon)
          </button>
          <div className="dialog-buttons">
            <button className="win-btn" onClick={closeAbout}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
}
