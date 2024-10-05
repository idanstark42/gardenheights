import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

const CameraFeed = ({ videoRef }) => {
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const constraints = {
          video: {
            facingMode: { exact: 'environment' },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
  const [acceleration, setAcceleration] = useState([0, 0, 0]);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = THREE.MathUtils.degToRad(event.alpha); // Z-axis rotation
      const beta = THREE.MathUtils.degToRad(event.beta); // X-axis rotation
      const gamma = THREE.MathUtils.degToRad(event.gamma); // Y-axis rotation

      // Update rotation based on device orientation
      setRotation([beta, alpha, -gamma]); // Adjust the rotation order as needed
    };

    const handleMotion = (event) => {
      const { accelerationIncludingGravity } = event;
      if (accelerationIncludingGravity) {
        const x = accelerationIncludingGravity.x || 0;
        const y = accelerationIncludingGravity.y || 0;
        const z = accelerationIncludingGravity.z || 0;

        // Update position based on acceleration
        setAcceleration([x, y, z]);
        setPosition((prevPosition) => [
          prevPosition[0] + x * 0.1, // Adjust multiplier for sensitivity
          prevPosition[1] - y * 0.1, // Invert Y for camera perspective
          prevPosition[2] + z * 0.1,
        ]);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
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
      <div style={{ position: 'absolute', bottom: 0, right: 0, padding: 10, color: 'white' }}>
        Acceleration: {acceleration.map((a) => a.toFixed(2)).join(', ')}
        <br />
        Position: {position.map((p) => p.toFixed(2)).join(', ')}
        <br />
        Rotation: {rotation.map((r) => r.toFixed(2)).join(', ')}
      </div>

    </div>
  );
};

export default ARExperience;
