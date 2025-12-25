import React from 'react'

function ToggleSwitch({ checked, onChange }) {
  return (
    <div 
      className={`toggle-switch ${checked ? 'active' : ''}`}
      onClick={onChange}
    >
      <div className="toggle-slider"></div>
    </div>
  )
}

function LayerControls({ layers, onToggleLayer }) {
  return (
    <div className="layer-controls">
      <h2>Ecological Layers</h2>
      
      <div className="layer-group">
        <label className={layers.forests ? 'active' : ''}>
          <span className="layer-icon">🌲</span>
          <span className="layer-text">Forest Restoration Zones</span>
          <ToggleSwitch 
            checked={layers.forests}
            onChange={() => onToggleLayer('forests')}
          />
        </label>
        
        <label className={layers.solar ? 'active' : ''}>
          <span className="layer-icon">☀️</span>
          <span className="layer-text">Solar Energy Zones</span>
          <ToggleSwitch 
            checked={layers.solar}
            onChange={() => onToggleLayer('solar')}
          />
        </label>
        
        <label className={layers.water ? 'active' : ''}>
          <span className="layer-icon">💧</span>
          <span className="layer-text">Water Resources</span>
          <ToggleSwitch 
            checked={layers.water}
            onChange={() => onToggleLayer('water')}
          />
        </label>
        
        <label className={layers.risks ? 'active' : ''}>
          <span className="layer-icon">⚠️</span>
          <span className="layer-text">Environmental Risks</span>
          <ToggleSwitch 
            checked={layers.risks}
            onChange={() => onToggleLayer('risks')}
          />
        </label>
      </div>
    </div>
  )
}

export default LayerControls

