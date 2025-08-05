import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useState } from 'react'

// Define a custom marker icon (Leaflet requires this for default icons to show properly)
const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// This component listens for clicks and lets you drag a marker
function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationChange(e.latlng)
    },
  })

  return position === null ? null : (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng()
          setPosition(newPos)
          onLocationChange(newPos)
        },
      }}
    />
  )
}

// Main map component
export default function WeatherMap({ onSelectLocation , onClose}) {
  return (
        <div
    style={{
        height: '500px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid #ddd',
    }}
    >
    {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '1.2rem',
            lineHeight: '0',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
          aria-label="Close Map"
        >
          ×
        </button>
              )}
    <MapContainer
        center={[37.7749, -122.4194]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
    >
        <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors, Humanitarian style'
      />
      <LocationMarker onLocationChange={onSelectLocation} />
    </MapContainer>
    </div>
  )
}
