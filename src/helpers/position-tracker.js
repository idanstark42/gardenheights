import { useState, useEffect } from 'react'
import { mat4, quat } from 'gl-matrix'

const MAX_TIME_WITHOUT_ACCELERATION = 100

export function usePhonePosition () {
  const [orientation, setOrientation] = useState([0, 0, 0])
  const [accelerationInDeviceRF, setAccelerationInDeviceRF] = useState([0, 0, 0])
  const [acceleration, setAcceleration] = useState([0, 0, 0])
  const [lastTime, setLastTime] = useState(0)
  const [velocity, setVelocity] = useState([0, 0, 0])
  const [lastVelocityChange, setLastVelocityChange] = useState(0)
  const [position, setPosition] = useState([0, 0, 0])

  useEffect(() => {
    setLastTime(Date.now())
    setLastVelocityChange(Date.now())
    const handleOrientation = (event) => {
      const alpha = radians(event.alpha)
      const beta = radians(event.beta)
      const gamma = radians(event.gamma)

      setOrientation([beta, alpha, gamma])
    }

    const handleMotion = (event) => {
      const { acceleration, interval } = event
      if (!acceleration) return
      const { x, y, z } = acceleration
      setAccelerationInDeviceRF([x, y, z])
    }

    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('devicemotion', handleMotion)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  useEffect(() => {
    const [x, y, z] = accelerationInDeviceRF
    if (x === 0 && y === 0 && z === 0) {
      setAcceleration([0, 0, 0])
      return
    }
    const [alpha, beta, gamma] = orientation
    const rotationMatrix = getRotationMatrixFromEuler(alpha, beta, gamma)
    const newAcceleration = [
      x * rotationMatrix[0] + y * rotationMatrix[1] + z * rotationMatrix[2],
      x * rotationMatrix[4] + y * rotationMatrix[5] + z * rotationMatrix[6],
      x * rotationMatrix[8] + y * rotationMatrix[9] + z * rotationMatrix[10],
    ]
    setAcceleration(newAcceleration)
  }, [accelerationInDeviceRF])

  useEffect(() => {
    if (acceleration.every(a => a === 0)) {
      if (Date.now() - lastVelocityChange > MAX_TIME_WITHOUT_ACCELERATION) {
        setVelocity([0, 0, 0])
        setLastVelocityChange(Date.now())
      }
      return
    }
    setLastVelocityChange(Date.now())
    const interval = (Date.now() - lastTime) / 1000
    const [ax, ay, az] = acceleration
    const [vx, vy, vz] = velocity
    setVelocity([vx + ax * interval, vy + ay * interval, vz + az * interval])
  }, [acceleration])

  useEffect(() => {
    const interval = (Date.now() - lastTime) / 1000
    const [vx, vy, vz] = velocity
    const [px, py, pz] = position
    setPosition([px + vx * interval, py + vy * interval, pz + vz * interval])
    setLastTime(Date.now())
  }, [velocity])

  return { orientation, acceleration, velocity, position }
}

function radians (degrees) {
  return degrees * Math.PI / 180
}

function getRotationMatrixFromEuler(alpha, beta, gamma) {
  const quaternion = quat.create()
  quat.fromEuler(quaternion, alpha, beta, gamma)
  
  const rotationMatrix = mat4.create()
  mat4.fromQuat(rotationMatrix, quaternion)

  return rotationMatrix
}