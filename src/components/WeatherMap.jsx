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
export default function WeatherMap({ onSelectLocation }) {
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
