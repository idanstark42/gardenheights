import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import CameraFeed from './camera_feed'

export default function Spyglass () {
  const [orientation, setOrientation] = useState([0, 0, 0])
  const [lastTimestamp, setLastTimestamp] = useState(0)
  const [acceleration, setAcceleration] = useState([0, 0, 0])
  const [velocity, setVelocity] = useState([0, 0, 0])
  const [devicePosition, setDevicePosition] = useState([0, 0, 0])

  useEffect(() => {
    setLastTimestamp(Date.now())

    const handleOrientation = (event) => {
      const alpha = THREE.MathUtils.degToRad(event.alpha)
      const beta = THREE.MathUtils.degToRad(event.beta)
      const gamma = THREE.MathUtils.degToRad(event.gamma)

      setOrientation([beta, alpha, -gamma])
    }

    const handleMotion = (event) => {
      const newTimestamp = Date.now()
      const dt = (newTimestamp - lastTimestamp) / 1000
      setLastTimestamp(newTimestamp)

      const { acceleration } = event
      if (!acceleration) return
      const newAcceleration = [acceleration.x, acceleration.y, acceleration.z]
      setAcceleration(newAcceleration)
      const newVelocity = velocity.map((v, i) => v + newAcceleration[i] * dt)
      setVelocity(newVelocity)
      const newDevicePosition = devicePosition.map((p, i) => p + newVelocity[i] * dt)
      setDevicePosition(newDevicePosition)
    }

    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('devicemotion', handleMotion)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  return (
    <div style={{ position: 'absolute', bottom: 0, right: 0, padding: 10, color: 'white', width: '100%', height: '100%' }}>
      Acceleration: {acceleration.map((a) => a.toFixed(2)).join(', ')}
      <br />
      Position: {devicePosition.map((p) => p.toFixed(2)).join(', ')}
      <br />
      Orientation: {orientation.map((r) => r.toFixed(2)).join(', ')}
    </div>
  )
}
