import React from 'react'
import './InfoPanel.css'

function InfoPanel({ selectedZone, onClose, onDeleteCheckpoint }) {
  const getTypeLabel = (type) => {
    const labels = {
      'forest': '🌲 Forest Restoration Zone',
      'solar': '☀️ Solar Energy Zone',
      'water': '💧 Water Resource',
      'risk': '⚠️ Risk Zone',
      'checkpoint': '📍 Checkpoint'
    }
    return labels[type] || type
  }

  const getDroughtRiskColor = (risk) => {
    switch(risk) {
      case 'low': return '#3b82f6'
      case 'medium': return '#f97316'
      case 'high': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getRecommendation = (type, zone) => {
    if (type === 'risk') {
      return 'This area should be avoided until proper clearance and safety measures are implemented.'
    }
    
    if (type === 'forest') {
      if (zone.water_nearby && zone.soil === 'fertile') {
        return 'Suitable for forest restoration 🌱'
      }
      if (zone.water_nearby) {
        return 'Moderately suitable for forest restoration - consider soil improvement'
      }
      return 'Additional environmental assessment required - water access needed'
    }
    
    if (type === 'solar') {
      if (zone.sun_days > 260) {
        return 'Highly recommended for solar power installation ☀️'
      }
      if (zone.sun_days > 250) {
        return 'Suitable for solar power installation'
      }
      return 'Moderate solar potential - consider alternative locations'
    }
    
    if (type === 'water') {
      if (zone.drought_risk === 'low') {
        return 'Reliable water source - suitable for development projects'
      }
      if (zone.drought_risk === 'medium') {
        return 'Water availability may vary - monitor conditions'
      }
      return 'High drought risk - water conservation measures required'
    }

    if (type === 'checkpoint') {
      return `Checkpoint created: ${new Date(zone.timestamp).toLocaleString()}`
    }
    
    return 'Additional environmental assessment required'
  }

  if (!selectedZone) {
    return null
  }

  const { type } = selectedZone

  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <h2>Zone Details</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>
      
      <div className="info-panel-content">
        <div className="zone-header">
          <h3>{selectedZone.name || selectedZone.title || selectedZone.type}</h3>
          <span className="zone-type">{getTypeLabel(type)}</span>
        </div>
      
        {type === 'forest' && (
          <div className="zone-details">
            <div className="detail-item">
              <span className="detail-label">Area:</span>
              <span className="detail-value">{selectedZone.area} hectares</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Soil Type:</span>
              <span className="detail-value">{selectedZone.soil}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Water Nearby:</span>
              <span className="detail-value">{selectedZone.water_nearby ? 'Yes' : 'No'}</span>
            </div>
          </div>
        )}
        
        {type === 'solar' && (
          <div className="zone-details">
            <div className="detail-item">
              <span className="detail-label">Potential:</span>
              <span className="detail-value highlight">
                {selectedZone.sun_days > 260 ? 'High' : selectedZone.sun_days > 250 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Area:</span>
              <span className="detail-value">15 hectares</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">Under Planning</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sunny Days:</span>
              <span className="detail-value">{selectedZone.sun_days}/year</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Distance to Grid:</span>
              <span className="detail-value">{selectedZone.distance_to_grid} km</span>
            </div>
          </div>
        )}
        
        {type === 'water' && (
          <div className="zone-details">
            <div className="detail-item">
              <span className="detail-label">Resource Type:</span>
              <span className="detail-value">{selectedZone.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Drought Risk:</span>
              <span className="detail-value" style={{ color: getDroughtRiskColor(selectedZone.drought_risk) }}>
                {selectedZone.drought_risk}
              </span>
            </div>
          </div>
        )}
        
        {type === 'risk' && (
          <div className="zone-details">
            <div className="detail-item">
              <span className="detail-label">Danger Level:</span>
              <span className="detail-value" style={{ color: '#ef4444' }}>{selectedZone.danger_level}</span>
            </div>
            {selectedZone.description && (
              <div className="detail-item">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{selectedZone.description}</span>
              </div>
            )}
          </div>
        )}
        
        {type === 'checkpoint' && (
          <div className="zone-details">
            <div className="detail-item">
              <span className="detail-label">Note:</span>
              <span className="detail-value">{selectedZone.note || 'No additional notes'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{new Date(selectedZone.timestamp).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{selectedZone.lat.toFixed(4)}, {selectedZone.lng.toFixed(4)}</span>
            </div>
            {onDeleteCheckpoint && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginTop: '1.5rem',
                width: '100%'
              }}>
                <button 
                  className="delete-checkpoint-button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this checkpoint?')) {
                      onDeleteCheckpoint(selectedZone.id)
                      onClose()
                    }
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className={type === 'risk' ? 'warning' : 'recommendation'}>
          <strong>{type === 'risk' ? '⚠️ Warning:' : '💡 Recommendation:'}</strong>{' '}
          {getRecommendation(type, selectedZone)}
        </div>
      </div>
    </div>
  )
}

export default InfoPanel

