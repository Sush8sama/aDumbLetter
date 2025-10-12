
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';


/**
 * A basic 3D envelope body component with customizable dimensions and textures.
 */
function EnvelopeBody({ envelopeWidth, envelopeHeight, envelopeDepth, frontTexturePath, backTexturePath }) {
    const [frontTexture, backTexture] = useTexture([
      frontTexturePath,
      backTexturePath,
      ]);

      const materials = [
          new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // right
          new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // left
          new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // top
          new THREE.MeshStandardMaterial({ color: 0x00d1d1ff }), // bottom
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
export default EnvelopeBody;