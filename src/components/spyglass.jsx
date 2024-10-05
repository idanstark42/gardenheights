import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, useCameraTexture } from '@react-three/xr'
import { useState } from 'react'

const store = createXRStore()

export default function Spyglass() {
  const [red, setRed] = useState(false)
  const cameraTexture = useCameraTexture()
  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <mesh pointerEventsType={{ deny: 'grab' }} onClick={() => setRed(!red)} position={[0, 1, -1]}>
            <boxGeometry />
            <meshBasicMaterial color={red ? 'red' : 'blue'} />
          </mesh>
          <mesh position={[0, 0, -1]}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial map={cameraTexture} />
          </mesh>
        </XR>
      </Canvas>
    </>
  )
}
