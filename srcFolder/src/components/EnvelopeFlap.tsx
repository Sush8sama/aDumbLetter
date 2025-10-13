
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useEffect } from 'react';


type EnvelopeFlapProps = {
    flapHeight: number;
    envelopeWidth: number; 
    flapTexturePath: string;
    x?: number;
    y?: number;
    z?: number;
};


/**
 * A basic 3D envelope flap component with customizable dimensions and textures.
 */
export default function EnvelopeFlap({ flapHeight, envelopeWidth, flapTexturePath, x=0, y=0, z=0.005 } : EnvelopeFlapProps) {
  const flapTexture = useTexture(
    flapTexturePath 
    ) as THREE.Texture;

  const flapGeometry = useMemo(() : THREE.BufferGeometry => {
    const geometry = new THREE.BufferGeometry();
    // could potentially place these parameters in props for more customization
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
    // could potentially place these parameters in props for more customization
    const uvs = new Float32Array([
         0.5, 0.0, // UV for top center vertex
         1.0, 1.0, // UV for bottom left vertex
         0.0, 1.0, // UV for bottom right vertex
      ]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();  

    return geometry;
    }, [envelopeWidth, flapHeight]); //only update stored geometry if these change

    // Dispose geometry on unmount to avoid GPU memory leaks
    useEffect(() => {
      return () => {
      flapGeometry.dispose();
    };
    }, [flapGeometry]);

    return (
    <mesh
      geometry={flapGeometry}
      position={[x, y, z]} // position relative to the envelope body
    >
    <meshStandardMaterial 
      map={flapTexture} 
      side={THREE.DoubleSide} 
    />
    </mesh>
  );
}
