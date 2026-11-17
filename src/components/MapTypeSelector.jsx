import React from 'react'
import Icon from './Icon'
import './MapTypeSelector.css'

const mapTypes = [
  { id: 'standard', name: 'Standard', icon: 'map' },
  { id: 'satellite', name: 'Satellite', icon: 'satellite' },
  { id: 'terrain', name: 'Terrain', icon: 'terrain' }
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
          <span className="map-type-icon"><Icon name={type.icon} size={20} /></span>
          <span className="map-type-name">{type.name}</span>
        </button>
      ))}
    </div>
  )
}

export default MapTypeSelector

