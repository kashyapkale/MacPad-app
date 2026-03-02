import { useApp } from '../store';
import { ICONS, TOOLBAR_ITEMS } from '../constants';

export default function Toolbar() {
  const { state, handleAction } = useApp();

  const isToggleActive = (toggleId?: string): boolean => {
    if (!toggleId) return false;
    const s = state.settings;
    switch (toggleId) {
      case 'wordWrap': return s.wordWrap;
      case 'showWhitespace': return s.showWhitespace;
      case 'documentMap': return s.documentMap;
      default: return false;
    }
  };

  return (
    <div className="toolbar">
      {TOOLBAR_ITEMS.map((item, idx) => {
        if (item.type === 'separator') {
          return <div key={idx} className="tool-separator" />;
        }
        const active = isToggleActive(item.toggleId);
        return (
          <button
            key={idx}
            className={`tool-btn ${active ? 'active' : ''}`}
            title={item.title}
            onClick={() => item.action && handleAction(item.action)}
          >
            {item.icon && ICONS[item.icon]}
          </button>
        );
      })}
      <div className="tool-separator" />
      <button
        className={`tool-btn dark-mode-toggle ${state.settings.darkMode ? 'active' : ''}`}
        title={state.settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        onClick={() => handleAction('toggleDarkMode')}
      >
        {state.settings.darkMode ? (
          <svg viewBox="0 0 20 20" width="16" height="16">
            <circle cx="10" cy="10" r="3.5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="10" y1="16" x2="10" y2="18" />
              <line x1="2" y1="10" x2="4" y2="10" />
              <line x1="16" y1="10" x2="18" y2="10" />
              <line x1="4.3" y1="4.3" x2="5.7" y2="5.7" />
              <line x1="14.3" y1="14.3" x2="15.7" y2="15.7" />
              <line x1="4.3" y1="15.7" x2="5.7" y2="14.3" />
              <line x1="14.3" y1="5.7" x2="15.7" y2="4.3" />
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="16" height="16">
            <path d="M10 3a7 7 0 1 0 6.3 10A5.5 5.5 0 0 1 10 3z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
