import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import CameraFeed from './camera_feed'
import { usePhonePosition } from '../helpers/position-tracker'

export default function Spyglass () {
  const { orientation, acceleration, velocity, position } = usePhonePosition()
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, padding: 10, width: '100%', height: '100%' }}>
      Velocity:
      <br />
      {velocity.map(v => v.toFixed(2)).join(', ')}
      <br />
      Position:
      <br />
      {position.map(p => p.toFixed(2)).join(', ')}
    </div>
  )
}
