import {Canvas, useFrame, useLoader} from '@react-three/fiber';
import { useRef, Suspense, useMemo } from 'react';
import { BoxGeometry, TextureLoader } from 'three';
import { RoundedBoxGeometry,RoundedBox, useTexture, Float } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';

function AnimatedEnvelope() {
const envelopeRef = useRef();
const flapRef = useRef();
const [frontTexture, backTexture, flapfront] = useTexture(['/FrontLetterWO.png', '/BackLetter.png', 'FrontFlapOut.png']);

const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { friction: 40, mass: 1, tension: 800 },
  }));
const bind = useDrag(({ active, movement: [mx, my], down, memo = spring.rotation.get() }) => {
    // `active` is true when dragging, `down` is true when mouse is pressed
    // `movement` is the displacement from where the drag started
    // `memo` is a value that persists between drag events, we initialize it with the current rotation
    api.start({
      // We map mouse x-movement to y-rotation, and y-movement to x-rotation
      // The division by 100 is a sensitivity factor
      rotation: [memo[0] + my / 100, memo[1] + mx / 100, 0],
    });
    return memo;
  });

const materials = [
    new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // right
    new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // left
    new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // top
    new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // bottom
    new THREE.MeshStandardMaterial({ map: frontTexture }),  // front
    new THREE.MeshStandardMaterial({ map: backTexture }),   // back
  ];

const envelopeWidth = 4.5;
const envelopeHeight = 3;
const envelopeDepth = 0.01;

const flapHeight = 1.5;


const flapGeometry = useMemo(() => {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // Top center point of the flap
      0.0, -flapHeight / 2 - 1.5, 0.0,
      // Bottom left point of the flap (aligned with envelope top-left)
      envelopeWidth / 2, flapHeight / 2- 0.75, 0.0,
      // Bottom right point of the flap (aligned with envelope top-right)
      -envelopeWidth / 2, flapHeight / 2- 0.75, 0.0,
    ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const indices = [0, 2, 1];
  geometry.setIndex(indices);

  const uvs = new Float32Array([
      0.5, 0.0, // UV for top center vertex
      1.0, 1.0, // UV for bottom left vertex
      0.0, 1.0, // UV for bottom right vertex
    ]);
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();  


  return geometry;
}, [envelopeWidth, flapHeight]);
  


  return (
    <animated.group {...bind()} {...spring}>
      <mesh material={materials} >
      <boxGeometry
      args={[envelopeWidth, envelopeHeight, envelopeDepth]}
      />
    </mesh>

    <mesh
      // ref={flapRef}
      geometry={flapGeometry}
      position={[0, envelopeHeight / 2, envelopeDepth / 2 + 0.002]} // Slightly in front of the envelope
      >
      <meshStandardMaterial map={flapfront} side={THREE.DoubleSide} />
      </mesh>
    </animated.group>
  )
}


function App() {

  return (
    <div id="canvas-container">
      <Canvas>
        <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedEnvelope />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App
