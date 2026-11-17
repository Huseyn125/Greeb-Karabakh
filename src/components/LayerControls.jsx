import React from 'react'
import Icon, { ICON_COLORS } from './Icon'

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
          <span className="layer-icon"><Icon name="forest" size={20} color={ICON_COLORS.forest} /></span>
          <span className="layer-text">Forest Restoration Zones</span>
          <ToggleSwitch 
            checked={layers.forests}
            onChange={() => onToggleLayer('forests')}
          />
        </label>
        
        <label className={layers.solar ? 'active' : ''}>
          <span className="layer-icon"><Icon name="solar" size={20} color={ICON_COLORS.solar} /></span>
          <span className="layer-text">Solar Energy Zones</span>
          <ToggleSwitch 
            checked={layers.solar}
            onChange={() => onToggleLayer('solar')}
          />
        </label>
        
        <label className={layers.water ? 'active' : ''}>
          <span className="layer-icon"><Icon name="water" size={20} color={ICON_COLORS.water} /></span>
          <span className="layer-text">Water Resources</span>
          <ToggleSwitch 
            checked={layers.water}
            onChange={() => onToggleLayer('water')}
          />
        </label>
        
        <label className={layers.risks ? 'active' : ''}>
          <span className="layer-icon"><Icon name="risk" size={20} color={ICON_COLORS.risk} /></span>
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

