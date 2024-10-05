import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import CameraFeed from './camera_feed'

export default function Spyglass () {
  const [orientation, setOrientation] = useState([0, 0, 0])
  const [velocities, setVelocities] = useState([[0, 0, 0]])
  const [devicePositions, setDevicePositions] = useState([[0, 0, 0]])
  const [lastDT, setLastDT] = useState(0)

  useEffect(() => {

    const handleOrientation = (event) => {
      const alpha = THREE.MathUtils.degToRad(event.alpha)
      const beta = THREE.MathUtils.degToRad(event.beta)
      const gamma = THREE.MathUtils.degToRad(event.gamma)

      setOrientation([beta, alpha, -gamma])
    }

    const handleMotion = (event) => {
      const { acceleration, interval } = event
      if (!acceleration || (acceleration.x === 0 && acceleration.y === 0 && acceleration.z === 0)) return
      setLastDT(interval / 1000)
      const newAcceleration = [acceleration.x, acceleration.y, acceleration.z].map((a) => a || 0)
      const newVelocity = velocities[0].map((v, i) => v + newAcceleration[i] * (interval / 1000))
      setVelocities(velocities => [newVelocity, ...velocities])
      const newDevicePosition = devicePositions[0].map((p, i) => p + newVelocity[i] * (interval / 1000))
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
          <li key={i} style={{ color: (v[0] === 0 ? 'black' : (v[0] > 0 ? 'green' : 'red')) }}>{v[0]}</li>
        ))}
      </ul>
      Position ({devicePositions.length} samples):
      <ul style={{ maxHeight: '20vh', overflowY: 'auto' }}>
        {devicePositions.map((p, i) => (
          <li key={i} style={{ color: (p[0] === 0 ? 'black' : (p[0] > 0 ? 'green' : 'red')) }}>{p[0]}</li>
        ))}
      </ul>
      delta time: {lastDT}
    </div>
  )
}
