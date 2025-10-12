import {Canvas, useFrame, useLoader} from '@react-three/fiber';
import { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { BoxGeometry, TextureLoader } from 'three';
import { RoundedBoxGeometry,RoundedBox, useTexture, Float } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { createPortal } from 'react-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css'; 


function AnimatedEnvelope({isOpen, currentPage}) {
const envelopeRef = useRef();
const flapRef = useRef();

const [frontTexture, backTexture, flapfront] = useTexture([
  '/textures/FrontLetterWO.png', 
  '/textures/BackLetter.png', 
  '/textures/FrontFlapOut.png', 
  ]);

const letterTextures = useTexture([
  '/textures/Letter1.png',
  '/textures/Letter2.png',
  '/textures/Letter3.png',
  '/textures/Letter4.png',
  '/textures/Letter5.png',
  '/textures/Letter6.png',
  '/textures/Letter7.png',
  '/textures/Letter8.png',
  ]);



const {rotation: flapRotation} = useSpring({
  rotation: isOpen ?[ -Math.PI ,0, 0]: [-0.035, 0, 0],
  config: {friction:200, mass: 1, tension:500, clamp: false},
});

const [dragSpring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { friction: 200, mass: 15, tension: 1000 },
  }));


// Fixes issues that for some reason my letters keep looking washed out
// This ensures the textures are in sRGB color space
useMemo(() => {
    letterTextures.forEach(texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, [letterTextures]);


const bind = useDrag(({ active, movement: [mx, my], down, memo = dragSpring.rotation.get() }) => {
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

const {position: letterPosition, opacity: letterOpacity} = useSpring({
  position: isOpen ? [0, 1, 1] : [0, 0, 0.005],
  opacity: isOpen ? 1 : 0,
  delay: isOpen ? 200 : 0,
  config: { friction: 10, mass: 1, tension: 50 },
});
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
  
    <animated.group {...bind()} {...dragSpring}>
      <mesh material={materials} >
      <boxGeometry
      args={[envelopeWidth, envelopeHeight, envelopeDepth]}
      />
    </mesh>

    <animated.group
    position={[0, envelopeHeight / 2, envelopeDepth / 2 + 0.005]} // Position at the top edge of the envelope
    rotation = {flapRotation }
    >
    <mesh
      // ref={flapRef}
      geometry={flapGeometry}
      position={[0, 0, 0.005]} // Slightly in front of the envelope
      >
      <meshStandardMaterial map={flapfront} side={THREE.DoubleSide} 
      />
      </mesh>
      </animated.group>

      <animated.mesh position={letterPosition}>
        <planeGeometry args={[envelopeWidth * 0.9, envelopeHeight * 0.9]} />
        <animated.meshStandardMaterial map={letterTextures[currentPage]} transparent={true} opacity={letterOpacity} />
      </animated.mesh>
    </animated.group>
    
  
  )
}








function App() {

  const pageCount = 8; 
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [unfolded, setUnfolded] = useState(false);
  const[textContent, setTextContent] = useState("");
  
  useEffect(() => {
    fetch('/Progress logs.txt')
      .then(response => response.text())
      .then(text => setTextContent(text))  
      .catch(error => console.error('Error fetching text file:', error));
  }, []);


  const handleNextPage = () => {
        if (!isOpen) return; // Prevent page turn if envelope is closed
        
        else {
        setCurrentPage(prevPage => Math.min(prevPage + 1, pageCount - 1));
        };
      
    };

  const handlePrevPage = () => {
        if (!isOpen) return; // Prevent page turn if envelope is closed
        else {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
        };
      
    };

  const toggleSidetab = () => {
    setUnfolded(!unfolded);
  }

  return (
  <>
    <div id="canvas-container">
      
        <div className="button-container">
                <img
                src={isOpen ? "/textures/Close.png" : "/textures/Open.png"}
                onClick={() => setIsOpen(!isOpen)}
                className='image-button'
                alt="Open/Close Envelope"
                />

                {isOpen && (
                  <img
                  src="/textures/Right.png"
                  onClick={handleNextPage}
                  className='right-button'
                  alt="Next Page"
                  />

                  )}
                {isOpen && (
                  <img
                  src="/textures/Left.png"
                  onClick={handlePrevPage}
                  className='left-button'
                  alt="Prev Page"
                  />
                  )}
                  
              
    </div>
    {isOpen && (
    <div className="page-count">
      <h2>{currentPage + 1} / {pageCount}</h2>
    </div>
  )}
    <Canvas >
        <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <AnimatedEnvelope isOpen={isOpen} currentPage={currentPage} />
        </Suspense>
      </Canvas>
    
    </div>
    
    <div className={`sidetab ${unfolded ? 'open' : ''}`}>

        <img
        src="/textures/logButton.png"
        onClick={toggleSidetab}
        className='log-button'
        />
        <img 
        src="/textures/Logs.png" 
        className="logs-background" />

        <div className="sidetab-header">  {/* Added a header and footer to manage the scroll window size XD */}
          </div>
        <SimpleBar className="sidetab-content">
          <p>
            {textContent}
          </p>
        </SimpleBar>
        <div className="sidetab-footer">
          </div>
      </div>
      </>
    
  );
}

export default App
