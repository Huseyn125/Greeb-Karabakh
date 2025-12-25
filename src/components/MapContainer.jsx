import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { MapContainer as LeafletMap, TileLayer, Circle, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ZoomControls from './ZoomControls'

// Map type configurations
const mapTypeConfigs = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '© Esri'
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '© OpenTopoMap contributors'
  }
}

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Component to handle map clicks
function MapClickHandler({ onMapClick, checkpointMode }) {
  useMapEvents({
    click: (e) => {
      if (checkpointMode) {
        onMapClick(e.latlng)
      }
    }
  })
  return null
}

const MapContainer = forwardRef(({ 
  regionData, 
  forestsData, 
  solarData, 
  waterData, 
  risksData, 
  layers, 
  checkpoints,
  onZoneClick,
  onMapClick,
  checkpointMode,
  onDeleteCheckpoint,
  selectedCity,
  mapType = 'standard',
  userLocation,
  nearbyRisks = []
}, ref) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize()
    }
  }, [layers])

  // Expose map methods to parent
  useImperativeHandle(ref, () => ({
    flyTo: (latlng, zoom, options) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(latlng, zoom, options)
      }
    }
  }))

  // Get map instance
  function MapInstance() {
    const map = useMap()
    useEffect(() => {
      mapInstanceRef.current = map
    }, [map])
    return null
  }

  const getDroughtRiskColor = (risk) => {
    switch(risk) {
      case 'low': return '#3b82f6'
      case 'medium': return '#f97316'
      case 'high': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getCheckpointIcon = (type) => {
    const icons = {
      'forest': '🌱',
      'solar': '☀️',
      'risk': '⚠️',
      'note': '📝'
    }
    return L.divIcon({
      className: 'checkpoint-marker',
      html: `<div style="font-size: 24px;">${icons[type] || '📍'}</div>`,
      iconSize: [30, 30]
    })
  }

  // Use selected city center if available, otherwise use region center
  const mapCenter = selectedCity 
    ? [selectedCity.lat, selectedCity.lng]
    : [regionData.center.lat, regionData.center.lng]
  
  const mapZoom = selectedCity ? 13 : regionData.zoom

  return (
    <LeafletMap
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      zoomControl={false}
    >
      <TileLayer
        url={mapTypeConfigs[mapType].url}
        attribution={mapTypeConfigs[mapType].attribution}
        maxZoom={19}
        minZoom={3}
      />
      
      {checkpointMode && <MapClickHandler onMapClick={onMapClick} checkpointMode={checkpointMode} />}
      
      <MapInstance />
      <ZoomControls />

      {/* Forest Zones */}
      {layers.forests && forestsData.map((zone, idx) => (
        <Circle
          key={`forest-${idx}`}
          center={[zone.lat, zone.lng]}
          radius={zone.area * 50}
          pathOptions={{
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.3,
            weight: 2
          }}
          eventHandlers={{
            click: () => onZoneClick(zone, 'forest')
          }}
        >
          <Popup>
            <b>{zone.name}</b><br />
            Area: {zone.area} hectares
          </Popup>
        </Circle>
      ))}

      {/* Solar Zones */}
      {layers.solar && solarData.map((zone, idx) => {
        const icon = L.divIcon({
          className: 'solar-icon',
          html: '<div style="font-size: 24px;">☀️</div>',
          iconSize: [30, 30]
        })
        return (
          <Marker
            key={`solar-${idx}`}
            position={[zone.lat, zone.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onZoneClick(zone, 'solar')
            }}
          >
            <Popup>
              <b>{zone.name}</b><br />
              Sunny days: {zone.sun_days}/year
            </Popup>
          </Marker>
        )
      })}

      {/* Water Resources */}
      {layers.water && waterData.map((resource, idx) => {
        const color = getDroughtRiskColor(resource.drought_risk)
        const icon = L.divIcon({
          className: 'water-icon',
          html: `<div style="font-size: 20px; color: ${color};">💧</div>`,
          iconSize: [25, 25]
        })
        return (
          <Marker
            key={`water-${idx}`}
            position={[resource.lat, resource.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onZoneClick(resource, 'water')
            }}
          >
            <Popup>
              <b>{resource.name}</b><br />
              Type: {resource.type}<br />
              Drought Risk: {resource.drought_risk}
            </Popup>
          </Marker>
        )
      })}

      {/* Risk Zones */}
      {layers.risks && risksData.map((risk, idx) => {
        const icon = L.divIcon({
          className: 'risk-icon',
          html: '<div style="font-size: 24px; color: #ef4444;">⚠️</div>',
          iconSize: [30, 30]
        })
        return (
          <React.Fragment key={`risk-${idx}`}>
            <Circle
              center={[risk.lat, risk.lng]}
              radius={200}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.2,
                weight: 3
              }}
              eventHandlers={{
                click: () => onZoneClick(risk, 'risk')
              }}
            />
            <Marker
              position={[risk.lat, risk.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onZoneClick(risk, 'risk')
              }}
            >
              <Popup>
                <b>⚠️ {risk.type.toUpperCase()}</b><br />
                Danger Level: {risk.danger_level}
              </Popup>
            </Marker>
          </React.Fragment>
        )
      })}

      {/* User Location */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div style="font-size: 24px; color: #3b82f6;">📍</div>',
              iconSize: [30, 30]
            })}
          >
            <Popup>
              <b>📍 Your Location</b><br />
              Lat: {userLocation.lat.toFixed(6)}<br />
              Lng: {userLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
          {/* Check radius circle (100m) */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={100}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '10, 5'
            }}
          />
        </>
      )}

      {/* Highlighted nearby risks */}
      {nearbyRisks.map((risk, idx) => (
        <React.Fragment key={`nearby-risk-${idx}`}>
          <Circle
            center={[risk.lat, risk.lng]}
            radius={200}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.3,
              weight: 4
            }}
          />
          <Marker
            position={[risk.lat, risk.lng]}
            icon={L.divIcon({
              className: 'nearby-risk-marker',
              html: '<div style="font-size: 28px; color: #ef4444; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8));">⚠️</div>',
              iconSize: [35, 35]
            })}
          >
            <Popup>
              <b>⚠️ {risk.type.toUpperCase()}</b><br />
              Danger Level: <strong style={{ color: '#ef4444' }}>{risk.danger_level}</strong><br />
              Distance: <strong>{(risk.distance).toFixed(0)}m</strong><br />
              {risk.description && (
                <>
                  <br />{risk.description}
                </>
              )}
            </Popup>
          </Marker>
        </React.Fragment>
      ))}

      {/* Checkpoints */}
      {checkpoints.map((checkpoint) => (
        <Marker
          key={checkpoint.id}
          position={[checkpoint.lat, checkpoint.lng]}
          icon={getCheckpointIcon(checkpoint.type)}
          eventHandlers={{
            click: () => onZoneClick(checkpoint, 'checkpoint')
          }}
        >
          <Popup>
            <div style={{ 
              minWidth: '200px',
              textAlign: 'center'
            }}>
              <div style={{ 
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                color: '#1d1d1f'
              }}>
                {checkpoint.title}
              </div>
              {checkpoint.note && (
                <div style={{ 
                  marginBottom: '12px',
                  fontSize: '0.875rem',
                  color: '#86868b'
                }}>
                  {checkpoint.note}
                </div>
              )}
              {onDeleteCheckpoint && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this checkpoint?')) {
                        onDeleteCheckpoint(checkpoint.id)
                      }
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease',
                      letterSpacing: '-0.2px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc2626'
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ef4444'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  )
})

export default MapContainer

