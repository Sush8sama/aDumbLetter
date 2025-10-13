
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';


type EnvelopeBodyProps = {
    envelopeWidth: number,
    envelopeHeight: number,
    envelopeDepth: number,
    frontTexturePath: string,
    backTexturePath: string,
};

/**
 * A basic 3D envelope body component with customizable dimensions and textures.
 */
export default function EnvelopeBody({ 
    envelopeWidth, 
    envelopeHeight, 
    envelopeDepth, 
    frontTexturePath, 
    backTexturePath }: EnvelopeBodyProps) {
    
    const [frontTexture, backTexture] = useTexture([
      frontTexturePath,
      backTexturePath,
    ]) as THREE.Texture[];

    const materials = [
        new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }),  // right
        new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }),  // left
        new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }),  // top
        new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }),  // bottom
        new THREE.MeshStandardMaterial({ map: frontTexture }),  // front
        new THREE.MeshStandardMaterial({ map: backTexture }),   // back
      ];

    return (
      <mesh material={materials} >
        <boxGeometry
        args={[envelopeWidth, envelopeHeight, envelopeDepth]}
        />
      </mesh>
    );
    }