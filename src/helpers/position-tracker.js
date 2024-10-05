import { useState, useEffect } from 'react'
import { mat4, quat } from 'gl-matrix'

export function usePhonePosition () {
  const [orientation, setOrientation] = useState([0, 0, 0])
  const [accelerationInDeviceRF, setAccelerationInDeviceRF] = useState([0, 0, 0])
  const [acceleration, setAcceleration] = useState([0, 0, 0])
  const [interval, setInterval] = useState(0)
  const [velocity, setVelocity] = useState([0, 0, 0])
  const [position, setPosition] = useState([0, 0, 0])

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = radians(event.alpha)
      const beta = radians(event.beta)
      const gamma = radians(event.gamma)

      setOrientation([beta, alpha, gamma])
    }

    const handleMotion = (event) => {
      const { acceleration, interval } = event
      if (!acceleration || (acceleration.x === 0 && acceleration.y === 0 && acceleration.z === 0)) return
      const { x, y, z } = acceleration
      setAccelerationInDeviceRF([x, y, z])
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
    const [x, y, z] = accelerationInDeviceRF
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