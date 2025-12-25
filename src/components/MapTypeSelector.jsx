import React from 'react'
import './MapTypeSelector.css'

const mapTypes = [
  { id: 'standard', name: 'Standard', icon: '🗺️' },
  { id: 'satellite', name: 'Satellite', icon: '🛰️' },
  { id: 'terrain', name: 'Terrain', icon: '⛰️' }
]

function MapTypeSelector({ mapType, onMapTypeChange }) {
  return (
    <div className="map-type-selector">
      {mapTypes.map(type => (
        <button
          key={type.id}
          className={`map-type-button ${mapType === type.id ? 'active' : ''}`}
          onClick={() => onMapTypeChange(type.id)}
          title={type.name}
        >
          <span className="map-type-icon">{type.icon}</span>
          <span className="map-type-name">{type.name}</span>
        </button>
      ))}
    </div>
  )
}

export default MapTypeSelector

