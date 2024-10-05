import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'


export default function App() {
  const [position, setPosition] = useState([32.07327763966522, 34.80796244196957])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([32.07327763966522, 34.80796244196957])
    })
  }, [])

  return (
    <MapContainer center={position} zoom={18} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  )
}
