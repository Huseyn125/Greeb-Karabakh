import React, { useState, useEffect, useRef } from 'react'
import MapContainer from './components/MapContainer'
import LayerControls from './components/LayerControls'
import InfoPanel from './components/InfoPanel'
import CheckpointModal from './components/CheckpointModal'
import MapTypeSelector from './components/MapTypeSelector'
import { embeddedData } from './data/embeddedData'
import { karabakhLocations } from './data/locations'
import { cityZonesData, defaultZones } from './data/cityZones'
import './App.css'

function App() {
  const [layers, setLayers] = useState({
    forests: false,
    solar: false,
    water: false,
    risks: false
  })
  
  const [checkpointMode, setCheckpointMode] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [checkpoints, setCheckpoints] = useState([])
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
  const [nearbyRisks, setNearbyRisks] = useState([])
  const watchIdRef = useRef(null)
  const mapRef = useRef(null)

  // Load checkpoints from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('greenKarabakhCheckpoints')
    if (saved) {
      setCheckpoints(JSON.parse(saved))
    }
  }, [])

  // Save checkpoints to localStorage
  useEffect(() => {
    if (checkpoints.length > 0) {
      localStorage.setItem('greenKarabakhCheckpoints', JSON.stringify(checkpoints))
    }
  }, [checkpoints])

  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }))
  }

  const handleZoneClick = (zone, type) => {
    setSelectedZone({ ...zone, type })
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
            alert('Unable to get your location. Please check your browser settings.')
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
        alert('Geolocation is not supported by your browser.')
      }
    }
  }

  // Calculate distance between two points (in km)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Check for nearby risk zones
  const handleCheckAround = () => {
    if (!userLocation) return

    const CHECK_RADIUS = 0.1 // 100 meters in km
    const allRisks = filteredData.risks || []
    const foundRisks = []

    for (const risk of allRisks) {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        risk.lat, 
        risk.lng
      )
      
      if (distance <= CHECK_RADIUS) {
        foundRisks.push({
          ...risk,
          distance: distance * 1000 // Convert to meters
        })
      }
    }

    setNearbyRisks(foundRisks)

    // Show result
    if (foundRisks.length > 0) {
      const riskTypes = foundRisks.map(r => r.type).join(', ')
      alert(`⚠️ Warning: Found ${foundRisks.length} risk zone(s) within 100m:\n${riskTypes}\n\nCheck the map for details.`)
    } else {
      alert('✅ Safe: No risk zones detected within 100 meters.')
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
    setCheckpoints(prev => {
      const updated = prev.filter(cp => cp.id !== checkpointId)
      // Update localStorage
      if (updated.length > 0) {
        localStorage.setItem('greenKarabakhCheckpoints', JSON.stringify(updated))
      } else {
        localStorage.removeItem('greenKarabakhCheckpoints')
      }
      return updated
    })
    if (selectedZone && selectedZone.id === checkpointId) {
      setSelectedZone(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🌿 EcoNexus</h1>
          <p>Interactive Ecological Map</p>
        </div>
        <div className="header-center">
          <div className="search-container">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8200 10.4424 11.8554L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8554 10.4424C11.8200 10.4062 11.7822 10.3734 11.7422 10.3439ZM12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z" fill="#86868b"/>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search region..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true)
                }
              }}
              onBlur={() => {
                // Delay to allow click on results
                setTimeout(() => setShowSearchResults(false), 200)
              }}
            />
            {selectedCity && (
              <button
                onClick={handleClearSearch}
                className="clear-search-button"
                title="Clear search"
              >
                ✕
              </button>
            )}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((location, idx) => (
                  <div
                    key={idx}
                    className="search-result-item"
                    onClick={() => handleSelectLocation(location)}
                  >
                    <span className="result-icon">
                      {location.type === 'city' ? '🏙️' : location.type === 'district' ? '📍' : '🏘️'}
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
            <span className="emergency-call-icon">📞</span>
            <span className="emergency-call-text">Emergency Call</span>
          </a>
        </div>
      </header>

      <div className="app-container">
        <main className={`map-container ${checkpointMode ? 'checkpoint-mode' : ''}`}>
          <aside className="left-panel">
            <LayerControls
              layers={layers}
              onToggleLayer={toggleLayer}
            />
          </aside>
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
          <div className="map-controls">
            <button 
              className={`checkpoint-button ${checkpointMode ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setCheckpointMode(!checkpointMode)
              }}
            >
              ↓ Add Checkpoints
            </button>
            <button 
              className={`location-button ${isTrackingLocation ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handleToggleLocation()
              }}
              title={isTrackingLocation ? 'Stop tracking location' : 'Track my location'}
            >
              📍 {isTrackingLocation ? 'Tracking' : 'My Location'}
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
                🔍 Check Around
              </button>
            )}
          </div>
        </main>

        {selectedZone && (
          <aside className="right-panel">
            <InfoPanel 
              selectedZone={selectedZone} 
              onClose={() => setSelectedZone(null)}
              onDeleteCheckpoint={selectedZone.type === 'checkpoint' ? handleDeleteCheckpoint : null}
            />
          </aside>
        )}
      </div>

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

