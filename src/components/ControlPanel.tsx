import React, { useState } from 'react';
import '../styles/main.scss';

interface ControlPanelProps {
  timeScale: number;
  sunIntensity: number;
  ambientIntensity: number;
  bloomIntensity: number;
  ssrIntensity?: number;
  ssaoIntensity?: number;
  onSunIntensityChange: (value: number) => void;
  onAmbientIntensityChange: (value: number) => void;
  onBloomIntensityChange: (value: number) => void;
  onTimeScaleChange: (value: number) => void;
  onSSRIntensityChange?: (value: number) => void;
  onSSAOIntensityChange?: (value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  timeScale,
  sunIntensity,
  ambientIntensity,
  bloomIntensity,
  ssrIntensity = 0.6,
  ssaoIntensity = 0.25,
  onSunIntensityChange,
  onAmbientIntensityChange,
  onBloomIntensityChange,
  onTimeScaleChange,
  onSSRIntensityChange,
  onSSAOIntensityChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Icons
  const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );

  const IconMinus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
  
  const IconPlay = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
  
  const IconFastForward = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 19 22 12 13 5 13 19"></polygon>
      <polygon points="2 19 11 12 2 5 2 19"></polygon>
    </svg>
  );
  
  const IconRewind = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 19 2 12 11 5 11 19"></polygon>
      <polygon points="22 19 13 12 22 5 22 19"></polygon>
    </svg>
  );
  
  const IconChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  
  const IconChevronUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  );

  // Handle time scale adjustments
  const speedUp = () => {
    onTimeScaleChange(Math.min(timeScale * 1.5, 10));
  };

  const slowDown = () => {
    onTimeScaleChange(Math.max(timeScale / 1.5, 0.1));
  };

  const resetSpeed = () => {
    onTimeScaleChange(1);
  };

  if (isCollapsed) {
    return (
      <div className="control-panel__collapsed" onClick={() => setIsCollapsed(false)}>
        <IconSettings />
      </div>
    );
  }

  return (
    <div className="control-panel">
      <div className="control-panel__header">
        <h2>Controls</h2>
        <button className="toggle-button" onClick={() => setIsCollapsed(true)}>
          <IconMinus />
        </button>
      </div>

      <div className="control-panel__section">
        <div className="control-panel__section-title">
          <span>Sun Brightness</span>
          <span className="value">{sunIntensity.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={sunIntensity}
          onChange={(e) => onSunIntensityChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-panel__section">
        <div className="control-panel__section-title">
          <span>Environment Light</span>
          <span className="value">{ambientIntensity.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.02"
          max="0.3"
          step="0.01"
          value={ambientIntensity}
          onChange={(e) => onAmbientIntensityChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="control-panel__section">
        <div className="control-panel__section-title">
          <span>Bloom Effect</span>
          <span className="value">{bloomIntensity.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={bloomIntensity}
          onChange={(e) => onBloomIntensityChange(parseFloat(e.target.value))}
        />
      </div>
      
      <div className="control-panel__advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
        <span>Advanced Ray Tracing</span>
        {showAdvanced ? <IconChevronUp /> : <IconChevronDown />}
      </div>
      
      {showAdvanced && onSSRIntensityChange && (
        <div className="control-panel__section">
          <div className="control-panel__section-title">
            <span>Reflections (SSR)</span>
            <span className="value">{ssrIntensity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ssrIntensity}
            onChange={(e) => onSSRIntensityChange(parseFloat(e.target.value))}
          />
        </div>
      )}
      
      {showAdvanced && onSSAOIntensityChange && (
        <div className="control-panel__section">
          <div className="control-panel__section-title">
            <span>Shadows (SSAO)</span>
            <span className="value">{ssaoIntensity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ssaoIntensity}
            onChange={(e) => onSSAOIntensityChange(parseFloat(e.target.value))}
          />
        </div>
      )}

      <div className="time-control">
        <button onClick={slowDown}>
          <IconRewind />
        </button>
        <button className="play-pause" onClick={resetSpeed}>
          <IconPlay />
        </button>
        <button onClick={speedUp}>
          <IconFastForward />
        </button>
        <div className="time-scale">{timeScale.toFixed(1)}x</div>
      </div>
    </div>
  );
};

export default ControlPanel; 