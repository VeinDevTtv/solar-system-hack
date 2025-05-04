import React, { useState, useEffect, useRef } from 'react';
import { usePlanetStore, KeyBindings, DEFAULT_KEYBINDINGS } from '../store';
import '../styles/SettingsPanel.scss';

const SettingsPanel: React.FC = () => {
  // Default to open during development to check if it renders at all
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'controls'>('general');
  const [listeningFor, setListeningFor] = useState<keyof KeyBindings | null>(null);
  const listeningRef = useRef<HTMLButtonElement | null>(null);
  
  // Debug log to see if component is rendering
  console.log("SettingsPanel rendering, collapsed:", isCollapsed);
  
  const { 
    settings, 
    updateKeyBinding, 
    updateMovementSpeed,
    updateMouseSensitivity,
    toggleInvertY, 
    toggleFreeCamera,
    resetKeyBindings
  } = usePlanetStore();
  
  // Icon components
  const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );

  const IconKeyboard = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <line x1="6" y1="8" x2="6" y2="8"></line>
      <line x1="10" y1="8" x2="10" y2="8"></line>
      <line x1="14" y1="8" x2="14" y2="8"></line>
      <line x1="18" y1="8" x2="18" y2="8"></line>
      <line x1="6" y1="12" x2="6" y2="12"></line>
      <line x1="10" y1="12" x2="10" y2="12"></line>
      <line x1="14" y1="12" x2="14" y2="12"></line>
      <line x1="18" y1="12" x2="18" y2="12"></line>
      <line x1="6" y1="16" x2="18" y2="16"></line>
    </svg>
  );

  const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const IconReset = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <path d="M3 3v5h5"></path>
    </svg>
  );

  // Handle key capture for rebinding
  useEffect(() => {
    if (!listeningFor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key.toLowerCase();
      
      // Don't allow keys that might break functionality
      if (['escape', 'tab', 'enter'].includes(key)) {
        return;
      }
      
      updateKeyBinding(listeningFor, e.key);
      setListeningFor(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [listeningFor, updateKeyBinding]);

  // Focus on the button when listening
  useEffect(() => {
    if (listeningFor && listeningRef.current) {
      listeningRef.current.focus();
    }
  }, [listeningFor]);

  // Format key label
  const formatKeyLabel = (key: string) => {
    switch (key.toLowerCase()) {
      case ' ':
        return 'Space';
      case 'arrowup':
        return '↑';
      case 'arrowdown':
        return '↓';
      case 'arrowleft':
        return '←';
      case 'arrowright':
        return '→';
      case 'control':
        return 'Ctrl';
      case 'shift':
        return 'Shift';
      default:
        return key.length === 1 ? key.toUpperCase() : key;
    }
  };

  // Display collapsed icon when minimized
  if (isCollapsed) {
    return (
      <div 
        className="settings-panel__collapsed" 
        onClick={() => setIsCollapsed(false)}
        style={{ cursor: 'pointer' }}
      >
        <IconSettings />
        <div style={{ position: 'absolute', bottom: -20, fontSize: 10, color: 'white', whiteSpace: 'nowrap' }}>
          Click for settings
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="settings-panel__header">
        <h2>Settings</h2>
        <div className="settings-panel__tabs">
          <button 
            className={activeTab === 'general' ? 'active' : ''} 
            onClick={() => setActiveTab('general')}
          >
            <IconSettings /> General
          </button>
          <button 
            className={activeTab === 'controls' ? 'active' : ''} 
            onClick={() => setActiveTab('controls')}
          >
            <IconKeyboard /> Controls
          </button>
        </div>
        <button className="close-button" onClick={() => setIsCollapsed(true)}>
          <IconX />
        </button>
      </div>

      <div className="settings-panel__content">
        {activeTab === 'general' && (
          <div className="settings-panel__general">
            <div className="settings-group">
              <h3>Camera</h3>
              
              <div className="setting-item">
                <label>Free Camera Mode</label>
                <div className="toggle-switch">
                  <input 
                    id="free-camera-toggle"
                    type="checkbox" 
                    checked={settings.freeCamera} 
                    onChange={() => {
                      console.log("Toggle clicked, current value:", settings.freeCamera);
                      toggleFreeCamera();
                    }} 
                  />
                  <label htmlFor="free-camera-toggle"></label>
                  <span className="slider"></span>
                </div>
              </div>

              <div className="setting-item">
                <label>Movement Speed</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0.2" 
                    max="5" 
                    step="0.1" 
                    value={settings.movementSpeed} 
                    onChange={(e) => updateMovementSpeed(parseFloat(e.target.value))} 
                  />
                  <span>{settings.movementSpeed.toFixed(1)}</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Mouse Sensitivity</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0.2" 
                    max="3" 
                    step="0.1" 
                    value={settings.mouseSensitivity} 
                    onChange={(e) => updateMouseSensitivity(parseFloat(e.target.value))} 
                  />
                  <span>{settings.mouseSensitivity.toFixed(1)}</span>
                </div>
              </div>

              <div className="setting-item">
                <label>Invert Y-Axis</label>
                <div className="toggle-switch">
                  <input 
                    id="invert-y-toggle"
                    type="checkbox" 
                    checked={settings.invertY} 
                    onChange={() => toggleInvertY()} 
                  />
                  <label htmlFor="invert-y-toggle"></label>
                  <span className="slider"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="settings-panel__controls">
            <div className="settings-group">
              <div className="setting-header">
                <h3>Keyboard Controls</h3>
                <button className="reset-button" onClick={() => resetKeyBindings()}>
                  <IconReset /> Reset to Default
                </button>
              </div>
              
              <div className="keybinds-container">
                {(Object.keys(settings.keyBindings) as Array<keyof KeyBindings>).map((action) => (
                  <div className="keybind-item" key={action}>
                    <span className="action-label">
                      {action.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <button
                      className={`keybind-button ${listeningFor === action ? 'listening' : ''}`}
                      onClick={() => setListeningFor(action)}
                      ref={listeningFor === action ? listeningRef : null}
                    >
                      {listeningFor === action 
                        ? 'Press a key...' 
                        : formatKeyLabel(settings.keyBindings[action])}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="help-text">
                <p>Click on a key to rebind it. Press Escape to cancel.</p>
                <p>Hold <strong>{formatKeyLabel(settings.keyBindings.speedBoost)}</strong> to boost movement speed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel; 