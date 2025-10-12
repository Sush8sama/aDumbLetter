
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A basic 3D envelope letter component with customizable dimensions and textures.
 */

function EnvelopeLetter( 
    letterArray, 
    isOpen,
    currentPage,
    envelopeWidth,
    envelopeHeight,
    openPosition = [0, 1, 1],
    closedPosition = [0, 0, 0.005],
    openOpacity = 1,
    closedOpacity = 0,
    openDelay = 200,
    friction = 10,
    mass = 1,
    tension = 50,) {
    
    const letterTextures = Array(letterArray.length);
    for (let i=0; i< letterArray.length; i++) {
        letterTextures[i] = useTexture(letterArray[i]);
    }

    const {position: letterPosition, opacity: letterOpacity} = useSpring({
        position: isOpen ? openPosition : closedPosition,
        opacity: isOpen ? openOpacity : closedOpacity,
        delay: isOpen ? openDelay : 0,
        config: { friction: friction, mass: mass, tension: tension },
    });

    return (
        <animated.mesh position={letterPosition}>
            <planeGeometry args={[envelopeWidth * 0.9, envelopeHeight * 0.9]} />
            <animated.meshStandardMaterial map={letterTextures[currentPage]} transparent={true} opacity={letterOpacity} />
        </animated.mesh>
    );
};
export default EnvelopeLetter;