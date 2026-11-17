import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Icon from './components/Icon'
import MapContainer from './components/MapContainer'
import LayerControls from './components/LayerControls'
import InfoPanel from './components/InfoPanel'
import CheckpointModal from './components/CheckpointModal'
import MapTypeSelector from './components/MapTypeSelector'
import Toast from './components/Toast'
import Legend from './components/Legend'
import DistrictDashboard from './components/DistrictDashboard'
import CheckResult from './components/CheckResult'
import { findRisksWithin } from './utils/geo'
import { embeddedData } from './data/embeddedData'
import { karabakhLocations } from './data/locations'
import { cityZonesData, defaultZones } from './data/cityZones'
import './App.css'

const CHECKPOINTS_KEY = 'greenKarabakhCheckpoints'
const CHECK_RADIUS_M = 100

function loadCheckpoints() {
  try {
    const saved = localStorage.getItem(CHECKPOINTS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function App() {
  const [layers, setLayers] = useState({
    forests: false,
    solar: false,
    water: false,
    risks: false
  })
  
  const [checkpointMode, setCheckpointMode] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [checkpoints, setCheckpoints] = useState(loadCheckpoints)
  const [showModal, setShowModal] = useState(false)
  const [pendingCheckpoint, setPendingCheckpoint] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [filteredData, setFilteredData] = useState({
    forests: defaultZones.forests,
    solar: defaultZones.solar,
    water: defaultZones.water,
    risks: defaultZones.risks
  })
  const [mapType, setMapType] = useState('standard')
  const [userLocation, setUserLocation] = useState(null)
  const [isTrackingLocation, setIsTrackingLocation] = useState(false)
  const [checkActive, setCheckActive] = useState(false)
  const [toasts, setToasts] = useState([])
  const [layerPanelOpen, setLayerPanelOpen] = useState(true)
  const watchIdRef = useRef(null)
  const mapRef = useRef(null)

  // Persist checkpoints (also when the list becomes empty)
  useEffect(() => {
    try {
      localStorage.setItem(CHECKPOINTS_KEY, JSON.stringify(checkpoints))
    } catch {
      // storage unavailable (private mode / quota) - keep working in memory
    }
  }, [checkpoints])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const notify = useCallback((type, title, message) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-2), { id, type, title, message }])
    setTimeout(() => dismissToast(id), 4500)
  }, [dismissToast])

  // Risks near the user, recomputed live while checking
  const nearbyRisks = useMemo(
    () => (checkActive ? findRisksWithin(userLocation, filteredData.risks, CHECK_RADIUS_M) : []),
    [checkActive, userLocation, filteredData.risks]
  )

  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }))
  }

  const handleZoneClick = (zone, type) => {
    // `kind` is the layer; `type` stays as the zone's own attribute (river, mine, ...)
    setSelectedZone({ ...zone, kind: type })
  }

  const handleMapClick = (latlng) => {
    if (checkpointMode) {
      setPendingCheckpoint(latlng)
      setShowModal(true)
    }
  }

  const handleSaveCheckpoint = (checkpointData) => {
    const newCheckpoint = {
      id: Date.now(),
      ...pendingCheckpoint,
      ...checkpointData,
      timestamp: new Date().toISOString()
    }
    setCheckpoints(prev => [...prev, newCheckpoint])
    setShowModal(false)
    setPendingCheckpoint(null)
    notify('success', 'Checkpoint added', checkpointData.title)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim().length > 0) {
      const results = karabakhLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10) // Limit to 10 results
      setSearchResults(results)
      setShowSearchResults(results.length > 0)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  // Get zones for a specific city
  const getCityZones = (cityName) => {
    const cityData = cityZonesData[cityName]
    if (!cityData) {
      // If city not found, return default zones
      return {
        forests: defaultZones.forests,
        solar: defaultZones.solar,
        water: defaultZones.water,
        risks: defaultZones.risks
      }
    }
    return cityData
  }

  // Find which layers have data for a city
  const getCityLayers = (cityName) => {
    const cityData = getCityZones(cityName)
    return {
      forests: cityData.forests && cityData.forests.length > 0,
      solar: cityData.solar && cityData.solar.length > 0,
      water: cityData.water && cityData.water.length > 0,
      risks: cityData.risks && cityData.risks.length > 0
    }
  }

  const handleSelectLocation = (location) => {
    setSearchQuery(location.name)
    setShowSearchResults(false)
    setSelectedCity(location)
    
    // Get zones for this city
    const cityZones = getCityZones(location.name)
    const cityLayers = getCityLayers(location.name)
    
    // Update filtered data with city-specific zones
    setFilteredData({
      forests: cityZones.forests || [],
      solar: cityZones.solar || [],
      water: cityZones.water || [],
      risks: cityZones.risks || []
    })
    
    // Enable layers that have data for this city
    setLayers(prev => ({
      ...prev,
      ...cityLayers
    }))
    
    // Fly to location
    if (mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lng], 13, {
        duration: 1.5
      })
    }
  }

  // Geolocation functions
  const handleToggleLocation = () => {
    if (isTrackingLocation) {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      setIsTrackingLocation(false)
      setUserLocation(null)
      setCheckActive(false)
    } else {
      // Start tracking
      if (navigator.geolocation) {
        setIsTrackingLocation(true)
        
        // Get current position first
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation({ lat: latitude, lng: longitude })
            
            // Center map on user location
            if (mapRef.current) {
              mapRef.current.flyTo([latitude, longitude], 15, {
                duration: 1.5
              })
            }
          },
          (error) => {
            console.error('Error getting location:', error)
            notify('error', 'Location unavailable', 'Please allow location access in your browser settings.')
            if (watchIdRef.current !== null) {
              navigator.geolocation.clearWatch(watchIdRef.current)
              watchIdRef.current = null
            }
            setIsTrackingLocation(false)
          }
        )
        
        // Watch position changes
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation({ lat: latitude, lng: longitude })
          },
          (error) => {
            console.error('Error watching location:', error)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )
      } else {
        notify('error', 'Not supported', 'Geolocation is not supported by your browser.')
      }
    }
  }

  // Check for nearby risk zones; the result card then updates live
  const handleCheckAround = () => {
    if (!userLocation) return
    // Risk data only exists for the selected district, so make sure it is visible
    setLayers(prev => ({ ...prev, risks: true }))
    setCheckActive(true)

    const found = findRisksWithin(userLocation, filteredData.risks, CHECK_RADIUS_M)
    if (found.length > 0) {
      notify('warning', `${found.length} risk zone(s) within ${CHECK_RADIUS_M} m`, 'Keep away from the highlighted areas.')
    } else if ((filteredData.risks || []).length === 0) {
      notify('info', 'No risk data here', 'Select a district to load its risk zones.')
    } else {
      notify('success', 'Safe', `No known risk zones within ${CHECK_RADIUS_M} m.`)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Reset filtered data when city is cleared
  const handleClearSearch = () => {
    setSearchQuery('')
    setSelectedCity(null)
    setFilteredData({
      forests: defaultZones.forests,
      solar: defaultZones.solar,
      water: defaultZones.water,
      risks: defaultZones.risks
    })
    setLayers({
      forests: false,
      solar: false,
      water: false,
      risks: false
    })
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      // Select first result
      handleSelectLocation(searchResults[0])
    }
  }

  const handleDeleteCheckpoint = (checkpointId) => {
    setCheckpoints(prev => prev.filter(cp => cp.id !== checkpointId))
    if (selectedZone && selectedZone.id === checkpointId) {
      setSelectedZone(null)
    }
    notify('info', 'Checkpoint deleted')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1><Icon name="logo" size={22} color="#16a34a" className="logo-icon" /> EcoNexus</h1>
          <p>Interactive Ecological Map</p>
        </div>
        <div className="header-center">
          <div className="search-container">
            <span className="search-icon">
              <Icon name="search" size={16} color="#86868b" />
            </span>
            <input 
              type="text" 
              placeholder="Search region..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true)
                }
              }}
              onBlur={() => setShowSearchResults(false)}
            />
            {selectedCity && (
              <button
                onClick={handleClearSearch}
                className="clear-search-button"
                title="Clear search"
              >
                <Icon name="close" size={12} />
              </button>
            )}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results" onMouseDown={(e) => e.preventDefault()}>
                {searchResults.map((location, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={() => handleSelectLocation(location)}
                  >
                    <span className="result-icon">
                      <Icon name={location.type === 'city' ? 'city' : location.type === 'district' ? 'district' : 'village'} size={20} color="#16a34a" />
                    </span>
                    <div className="result-info">
                      <span className="result-name">{location.name}</span>
                      <span className="result-type">{location.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="header-right">
          <a 
            href="tel:112" 
            className="emergency-call-button"
            onClick={(e) => {
              // Allow default behavior (phone call)
            }}
          >
            <span className="emergency-call-icon"><Icon name="phone" size={18} /></span>
            <span className="emergency-call-text">Emergency Call</span>
          </a>
        </div>
      </header>

      <div className="app-container">
        <main className={`map-container ${checkpointMode ? 'checkpoint-mode' : ''}`}>
          <aside className={`left-panel ${layerPanelOpen ? '' : 'collapsed'}`}>
            <button
              className="sheet-handle"
              onClick={() => setLayerPanelOpen(open => !open)}
              aria-expanded={layerPanelOpen}
            >
              Layers &amp; stats
            </button>
            <LayerControls
              layers={layers}
              onToggleLayer={toggleLayer}
            />
            <DistrictDashboard
              title={selectedCity ? selectedCity.name : 'Demo region'}
              data={filteredData}
            />
          </aside>
          <Legend />
          <MapContainer
            ref={mapRef}
            regionData={embeddedData.region}
            forestsData={filteredData.forests}
            solarData={filteredData.solar}
            waterData={filteredData.water}
            risksData={filteredData.risks}
            layers={layers}
            checkpoints={checkpoints}
            onZoneClick={handleZoneClick}
            onMapClick={handleMapClick}
            checkpointMode={checkpointMode}
            onDeleteCheckpoint={handleDeleteCheckpoint}
            selectedCity={selectedCity}
            mapType={mapType}
            userLocation={userLocation}
            nearbyRisks={nearbyRisks}
          />
          <MapTypeSelector 
            mapType={mapType}
            onMapTypeChange={setMapType}
          />
          {checkActive && isTrackingLocation && userLocation && (
            <CheckResult
              risks={nearbyRisks}
              radius={CHECK_RADIUS_M}
              onClose={() => setCheckActive(false)}
            />
          )}
          <div className="map-controls">
            <button 
              className={`checkpoint-button ${checkpointMode ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setCheckpointMode(!checkpointMode)
              }}
            >
              <Icon name="addPin" size={16} /> Add Checkpoints
            </button>
            <button 
              className={`location-button ${isTrackingLocation ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handleToggleLocation()
              }}
              title={isTrackingLocation ? 'Stop tracking location' : 'Track my location'}
            >
              <Icon name="locate" size={16} /> {isTrackingLocation ? 'Tracking' : 'My Location'}
            </button>
            {isTrackingLocation && userLocation && (
              <button 
                className="check-around-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCheckAround()
                }}
                title="Check for risk zones within 100m"
              >
                <Icon name="scan" size={16} /> Check Around
              </button>
            )}
          </div>
        </main>

        {selectedZone && (
          <aside className="right-panel">
            <InfoPanel 
              selectedZone={selectedZone} 
              onClose={() => setSelectedZone(null)}
              risks={filteredData.risks}
              onDeleteCheckpoint={selectedZone.kind === 'checkpoint' ? handleDeleteCheckpoint : null}
            />
          </aside>
        )}
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      {showModal && (
        <CheckpointModal
          onClose={() => {
            setShowModal(false)
            setPendingCheckpoint(null)
          }}
          onSave={handleSaveCheckpoint}
        />
      )}

    </div>
  )
}

export default App

