import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import CameraFeed from './camera_feed'

export default function Spyglass () {
  const [orientation, setOrientation] = useState([0, 0, 0])
  const [lastTimestamp, setLastTimestamp] = useState(0)
  const [velocities, setVelocities] = useState([[0, 0, 0]])
  const [devicePositions, setDevicePositions] = useState([[0, 0, 0]])
  const [log, setLog] = useState([])

  useEffect(() => {
    setLog((log) => [...log, 'starting'])
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
      if (dt < 0.1) return

      setLastTimestamp(newTimestamp)

      const { acceleration } = event
      if (!acceleration) return
      const newAcceleration = [acceleration.x, acceleration.y, acceleration.z].map((a) => a || 0)
      const newVelocity = velocities[0].map((v, i) => v + newAcceleration[i] * dt)
      setVelocities(velocities => [newVelocity, ...velocities])
      const newDevicePosition = devicePositions[0].map((p, i) => p + newVelocity[i] * dt)
      setDevicePositions(positions => [newDevicePosition, ...positions])
    }

    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('devicemotion', handleMotion)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  return (
    <div style={{ position: 'absolute', bottom: 0, right: 0, padding: 10, width: '100%', height: '100%' }}>
      Velocity ({velocities.length} samples):
      <ul style={{ maxHeight: '20vh', overflowY: 'auto' }}>
        {velocities.map((v, i) => (
          <li key={i}>{v.join(', ')}</li>
        ))}
      </ul>
      Position ({devicePositions.length} samples):
      <ul style={{ maxHeight: '20vh', overflowY: 'auto' }}>
        {devicePositions.map((p, i) => (
          <li key={i}>{p.join(', ')}</li>
        ))}
      </ul>
    </div>
  )
}
