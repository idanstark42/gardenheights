import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraFeed = ({ videoRef }) => {
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    getUserMedia();
  }, [videoRef]);

  return (
    <video
      ref={videoRef}
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
  );
};

const Box = ({ position, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
};

const ARExperience = () => {
  const videoRef = useRef();
  const [position, setPosition] = useState([0, 0.5, -1]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = THREE.MathUtils.degToRad(event.alpha); // Z-axis rotation
      const beta = THREE.MathUtils.degToRad(event.beta); // X-axis rotation
      const gamma = THREE.MathUtils.degToRad(event.gamma); // Y-axis rotation

      // Update rotation based on device orientation
      setRotation([beta, alpha, -gamma]); // Adjust the rotation order as needed
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <CameraFeed videoRef={videoRef} />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={position} rotation={rotation} />
      </Canvas>
    </div>
  );
};

export default ARExperience;
