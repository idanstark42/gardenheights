import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraFeed = ({ videoRef }) => {
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

const Box = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Rotate the box
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, -1]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
};

const Spyglass = () => {
  const videoRef = useRef();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <CameraFeed videoRef={videoRef} />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box />
      </Canvas>
    </div>
  );
};

export default Spyglass;
