import React, { useEffect, useRef } from 'react'

export default function CameraFeed () {
  const videoRef = useRef()

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        if (!videoRef.current) return
        const constraints = { video: { facingMode: { exact: 'environment' } } }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        videoRef.current.srcObject = stream
        videoRef.current.play()
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }
    getUserMedia()
  }, [videoRef])

  return (
    <video ref={videoRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
      }}
      playsInline
    />
  )
}
