import { useApp } from '../store';
import type { ContextMenuItem } from '../types';

export default function ContextMenu() {
  const { contextMenu, hideContextMenu, handleAction } = useApp();

  if (!contextMenu) return null;

  // Adjust position to stay within viewport
  let { x, y } = contextMenu;
  const menuW = 220;
  const menuH = contextMenu.items.length * 28;
  if (x + menuW > window.innerWidth) x = window.innerWidth - menuW;
  if (y + menuH > window.innerHeight) y = window.innerHeight - menuH;

  return (
    <div
      className="context-menu"
      style={{ left: x, top: y }}
      onMouseDown={e => e.stopPropagation()}
    >
      {contextMenu.items.map((item, idx) => {
        if ('type' in item && item.type === 'separator') {
          return <div key={idx} className="context-menu-separator" />;
        }
        const menuItem = item as ContextMenuItem;
        return (
          <div
            key={idx}
            className={`context-menu-item ${menuItem.disabled ? 'disabled' : ''}`}
            onClick={() => {
              hideContextMenu();
              if (typeof menuItem.action === 'function') {
                menuItem.action();
              } else {
                handleAction(menuItem.action);
              }
            }}
          >
            <span>{menuItem.label}</span>
            {menuItem.shortcut && <span className="shortcut">{menuItem.shortcut}</span>}
          </div>
        );
      })}
    </div>
  );
}
