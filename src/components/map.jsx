import { useState, useEffect } from 'react'
import { icon } from 'leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const ICONS = {
  CAT: icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),
  LOCATION: icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Basic_red_dot.png',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  }),
}

export default function Map() {
  const [position, setPosition] = useState([32.07327763966522, 34.80796244196957])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([32.07327763966522, 34.80796244196957])
    })
  }, [])

  return (
    <MapContainer center={position} zoom={17} style={{ width: '100%', height: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={position} icon={ICONS.LOCATION} />
    </MapContainer>
  )
}
