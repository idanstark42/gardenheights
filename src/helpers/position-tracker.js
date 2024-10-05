import { useState, useEffect } from 'react'

export function usePhonePosition () {
  const [orientation, setOrientation] = useState([0, 0, 0])
  const [acceleration, setAcceleration] = useState([0, 0, 0])
  const [interval, setInterval] = useState(0)
  const [velocity, setVelocity] = useState([0, 0, 0])
  const [position, setPosition] = useState([0, 0, 0])

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha
      const beta = event.beta
      const gamma = event.gamma

      setOrientation([beta, alpha, -gamma])
    }

    const handleMotion = (event) => {
      const { acceleration, interval } = event
      if (!acceleration || (acceleration.x === 0 && acceleration.y === 0 && acceleration.z === 0)) return
      setAcceleration([acceleration.x, acceleration.y, acceleration.z])
      setInterval(interval / 1000)
    }

    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('devicemotion', handleMotion)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  useEffect(() => {
    const [ax, ay, az] = acceleration
    const [vx, vy, vz] = velocity
    setVelocity([vx + ax * interval, vy + ay * interval, vz + az * interval])
  }, [acceleration])

  useEffect(() => {
    const [vx, vy, vz] = velocity
    const [px, py, pz] = position
    setPosition([px + vx * interval, py + vy * interval, pz + vz * interval])
  }, [velocity])

  return { orientation, acceleration, velocity, position }
}