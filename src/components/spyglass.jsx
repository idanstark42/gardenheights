import { Canvas, createPortal, useThree } from '@react-three/fiber'
import { createXRStore, XR, XRDomOverlay, XROrigin } from '@react-three/xr'
import { useEffect, useState } from 'react'
import {} from '@react-three/drei'

const store = createXRStore()

export default function Spyglass() {
  const [bool, setBool] = useState(false)
  const [text, setText] = useState('Hello World')

  useEffect(() => {
    store.onEnterAR = () => {
      setText('Entered AR')
    }
    store.onExitAR = () => {
      setText('Exited AR')
    }
  }, [])

  const enter = async () => {
    try {
      await store.enterAR()
    } catch (err) {
      console.error(err)
      setText('Error entering AR: ' + err.message)
  }


  return (
    <>
      <button onClick={enter}>Enter AR</button>
      <button onClick={() => store.exitAR()}>Exit AR</button>
      <p>{text}</p>
      <Canvas style={{ width: '100%', flexGrow: 1 }}>
        <XR store={store}>
          <XROrigin />

          <XRDomOverlay
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div
              style={{ backgroundColor: bool ? 'red' : 'green', padding: '1rem 2rem' }}
              onClick={() => setBool((b) => !b)}
            >
              Hello World
            </div>
          </XRDomOverlay>
        </XR>
      </Canvas>
    </>
  )
}