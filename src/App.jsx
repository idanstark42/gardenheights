import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'


export default function App() {
  const [position, setPosition] = useState([51.505, -0.09])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude])
    })
  }, [])

  return (
    <MapContainer center={position}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}
