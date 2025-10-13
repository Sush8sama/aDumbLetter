
import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import type { Texture } from 'three';

/**
 * A basic 3D envelope letter component with customizable dimensions and textures.
 */

type EnvelopeLetterProps = {
    letterPathArray: string[],
    isOpen: boolean,
    currentPage: number,
    envelopeWidth: number,
    envelopeHeight: number,
    openPosition?: [number, number, number],
    closedPosition?: [number, number, number],
    openOpacity?: number,                           
    closedOpacity?: number,                         
    openDelay?: number,
    friction?: number,
    mass?: number,
    tension?: number,
};

// This prevents TypeScript from expanding the huge generic type.
const AnimatedMeshStandardMaterial: any = animated.meshStandardMaterial;

export default function EnvelopeLetter({
    letterPathArray, 
    isOpen,
    currentPage,
    envelopeWidth,
    envelopeHeight,
    openPosition = [0, 1, 1],
    closedPosition = [0, 0, 0.005],
    openOpacity = 1,               // Opacity of the letter when the envelope is open
    closedOpacity = 0,             // Opacity of the letter when the envelope is closed 
    openDelay = 200,               // Delay before the letter fades in when the envelope is opened
    friction = 10,
    mass = 1,
    tension = 50,}: EnvelopeLetterProps ) {
    
    const letterTextures = useTexture(letterPathArray) as Texture[];

    // Ensure textures are in sRGB color space for correct color representation
    useMemo(() => {
        letterTextures.forEach(texture => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
        });
      }, [letterTextures]);
 

    const spring = useSpring <{ position: [number, number, number]; opacity: number}> ({
        position: isOpen ? openPosition : closedPosition,
        opacity: isOpen ? openOpacity : closedOpacity,
        delay: isOpen ? openDelay : 0,
        config: { friction, mass, tension },
    });

    return (
        <animated.mesh position={spring.position}>
            <planeGeometry args={[envelopeWidth * 0.9, envelopeHeight * 0.9]} />
            <AnimatedMeshStandardMaterial
                map={letterTextures[currentPage]} 
                transparent={true} 
                opacity={spring.opacity} 
            />
        </animated.mesh>
    );
};
