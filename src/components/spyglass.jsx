import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import CameraFeed from './camera_feed'

export default function Spyglass () {
  const [rotation, setRotation] = useState([0, 0, 0])
  const [lastTimestamp, setLastTimestamp] = useState(0)
  const [acceleration, setAcceleration] = useState([0, 0, 0])
  const [velocity, setVelocity] = useState([0, 0, 0])
  const [devicePosition, setDevicePosition] = useState([0, 0, 0])

  useEffect(() => {
    setLastTimestamp(Date.now())

    const handleOrientation = (event) => {
      const alpha = THREE.MathUtils.degToRad(event.alpha) // Z-axis rotation
      const beta = THREE.MathUtils.degToRad(event.beta) // X-axis rotation
      const gamma = THREE.MathUtils.degToRad(event.gamma) // Y-axis rotation

      // Update rotation based on device orientation
      setRotation([beta, alpha, -gamma]) // Adjust the rotation order as needed
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
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <CameraFeed />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
      <div style={{ position: 'absolute', bottom: 0, right: 0, padding: 10, color: 'white' }}>
        Acceleration: {acceleration.map((a) => a.toFixed(2)).join(', ')}
        <br />
        Position: {position.map((p) => p.toFixed(2)).join(', ')}
        <br />
        Rotation: {rotation.map((r) => r.toFixed(2)).join(', ')}
      </div>

    </div>
  )
}
