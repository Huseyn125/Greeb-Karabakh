import React from 'react'
import Icon from './Icon'
import { useMap } from 'react-leaflet'

function ZoomControls() {
  const map = useMap()

  const zoomIn = () => {
    map.zoomIn()
  }

  const zoomOut = () => {
    map.zoomOut()
  }

  return (
    <div className="zoom-controls-container">
      <button className="zoom-button" onClick={zoomIn} title="Zoom In">
        <Icon name="plus" size={18} />
      </button>
      <button className="zoom-button" onClick={zoomOut} title="Zoom Out">
        <Icon name="minus" size={18} />
      </button>
    </div>
  )
}

export default ZoomControls

