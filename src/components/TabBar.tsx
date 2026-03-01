import { useCallback } from 'react';
import { useApp } from '../store';
import { getLanguageIconColor } from '../constants';

export default function TabBar() {
  const { state, dispatch, handleAction, showContextMenu } = useApp();

  const handleTabClick = useCallback((tabId: string) => {
    dispatch({ type: 'SWITCH_TAB', payload: { id: tabId } });
  }, [dispatch]);

  const handleTabClose = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    dispatch({ type: 'CLOSE_TAB', payload: { id: tabId } });
  }, [dispatch]);

  const handleMiddleClick = useCallback((e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      e.preventDefault();
      dispatch({ type: 'CLOSE_TAB', payload: { id: tabId } });
    }
  }, [dispatch]);

  const handleTabContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, [
      { label: 'Close', action: () => dispatch({ type: 'CLOSE_TAB', payload: { id: tabId } }) },
      { label: 'Close Others', action: () => {
        dispatch({ type: 'SWITCH_TAB', payload: { id: tabId } });
        dispatch({ type: 'CLOSE_OTHER_TABS' });
      }},
      { label: 'Close All', action: () => dispatch({ type: 'CLOSE_ALL_TABS' }) },
      { type: 'separator' as const },
      { label: 'Rename', action: () => {
        const tab = state.tabs.find(t => t.id === tabId);
        if (!tab) return;
        const name = prompt('Rename tab:', tab.title);
        if (name) dispatch({ type: 'RENAME_TAB', payload: { id: tabId, title: name } });
      }},
    ]);
  }, [state.tabs, dispatch, showContextMenu]);

  return (
    <div className="tab-bar">
      <div className="tab-scroll-area">
        {state.tabs.map(tab => {
          const isActive = tab.id === state.activeTabId;
          const color = getLanguageIconColor(tab.language);

          return (
            <div
              key={tab.id}
              className={`tab ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              onMouseDown={(e) => handleMiddleClick(e, tab.id)}
              onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 14 14">
                  <rect x="1" y="0" width="12" height="14" rx="1" fill={color} opacity="0.8" />
                  <rect x="3" y="3" width="8" height="1" fill="#fff" opacity="0.6" rx="0.5" />
                  <rect x="3" y="6" width="6" height="1" fill="#fff" opacity="0.6" rx="0.5" />
                  <rect x="3" y="9" width="7" height="1" fill="#fff" opacity="0.6" rx="0.5" />
                </svg>
              </span>
              <span className="tab-title">{tab.title}</span>
              {tab.modified && <span className="tab-modified-dot" />}
              <button
                className="tab-close"
                onClick={(e) => handleTabClose(e, tab.id)}
                title="Close"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <button
        className="tab-new-btn"
        onClick={() => handleAction('newFile')}
        title="New Tab"
      >
        +
      </button>
    </div>
  );
}
