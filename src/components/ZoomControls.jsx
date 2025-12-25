import React from 'react'
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
        +
      </button>
      <button className="zoom-button" onClick={zoomOut} title="Zoom Out">
        −
      </button>
    </div>
  )
}

export default ZoomControls

