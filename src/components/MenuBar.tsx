import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../store';
import { MENU_STRUCTURE } from '../constants';
import type { MenuActionItem } from '../types';

export default function MenuBar() {
  const { state, handleAction, activeTab } = useApp();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuBarActive, setMenuBarActive] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
        setMenuBarActive(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMenuClick = useCallback((menuId: string) => {
    if (openMenuId === menuId) {
      setOpenMenuId(null);
      setMenuBarActive(false);
    } else {
      setOpenMenuId(menuId);
      setMenuBarActive(true);
    }
  }, [openMenuId]);

  const handleMenuEnter = useCallback((menuId: string) => {
    if (menuBarActive && openMenuId !== menuId) {
      setOpenMenuId(menuId);
    }
  }, [menuBarActive, openMenuId]);

  const handleItemClick = useCallback((item: MenuActionItem) => {
    if (item.disabled) return;
    setOpenMenuId(null);
    setMenuBarActive(false);
    if (item.action) {
      handleAction(item.action, item.data);
    }
  }, [handleAction]);

  const isChecked = useCallback((item: MenuActionItem): boolean => {
    if (!item.checkable) return false;
    const s = state.settings;

    // Settings toggles
    switch (item.action) {
      case 'toggleWordWrap': return s.wordWrap;
      case 'toggleWhitespace': return s.showWhitespace;
      case 'toggleDocumentMap': return s.documentMap;
      case 'toggleDarkMode': return s.darkMode;
      case 'toggleSpacesForTabs': return s.spacesForTabs;
      case 'toggleLineNumbers': return s.lineNumbers;
      case 'toggleActiveLine': return s.activeLine;
      case 'toggleMatchBrackets': return s.matchBrackets;
      case 'toggleAutoCloseBrackets': return s.autoCloseBrackets;
      case 'toggleCodeFolding': return s.codeFolding;
    }

    // Radio groups
    if (item.group === 'encoding') return state.encoding === item.data;
    if (item.group === 'language') return activeTab?.language === item.data;
    if (item.group === 'tabsize') return s.tabSize === Number(item.data);

    return false;
  }, [state, activeTab]);

  return (
    <div className="menu-bar" ref={barRef}>
      {MENU_STRUCTURE.map(menu => (
        <div
          key={menu.id}
          className={`menu-item ${openMenuId === menu.id ? 'open' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); handleMenuClick(menu.id); }}
          onMouseEnter={() => handleMenuEnter(menu.id)}
        >
          {menu.label}
          {openMenuId === menu.id && (
            <div className="menu-dropdown" onMouseDown={e => e.stopPropagation()}>
              {menu.items.map((item, idx) => {
                if (item.type === 'separator') {
                  return <div key={idx} className="menu-separator" />;
                }
                const checked = isChecked(item);
                return (
                  <div
                    key={idx}
                    className={`menu-dropdown-item ${item.disabled ? 'disabled' : ''} ${checked ? 'checked' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="shortcut">{item.shortcut}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
