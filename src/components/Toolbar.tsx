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
    </div>
  );
}
