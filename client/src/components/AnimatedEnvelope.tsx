import EnvelopeBody from './EnvelopeBody';
import EnvelopeFlap from './EnvelopeFlap';
import EnvelopeLetter from './EnvelopeLetter';
import { useSpring, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';

type AnimatedEnvelopeProps = {
    bodyFriction?: number,
    bodyMass?: number,
    bodyTension?: number,
    flapFriction?: number,
    flapMass?: number,
    flapTension?: number,
    frontTexturePath: string,
    backTexturePath: string,
    flapTexturePath: string,
    flapHeight?: number,
    envelopeWidth?: number, 
    envelopeHeight?: number,
    envelopeDepth?: number,
    flapOpenRotation?: [number, number, number],
    flapClosedRotation?: [number, number, number],
    isOpen: boolean,
    letterPathArray: string[],
    currentPage: number,
};

/**
 * A composite 3D animated envelope component that includes body, flap, and letter components with drag and spring animations.
 */
export default function AnimatedEnvelope({
    bodyFriction = 200,                      // Friction of the envelope body
    bodyMass = 15,                           // Mass of the envelope body
    bodyTension = 1000,                      // Tension of the envelope body             
    flapFriction = 200,                      // Friction of the envelope flap
    flapMass = 1,                            // Mass of the envelope flap
    flapTension = 500,                       // Tension of the envelope flap
    frontTexturePath,
    backTexturePath,
    flapTexturePath,
    flapHeight = 1.5,
    envelopeWidth = 4.5,
    envelopeHeight = 3,
    envelopeDepth = 0.01,
    flapOpenRotation = [-Math.PI, 0, 0],      // Rotation of the flap when the envelope is open
    flapClosedRotation = [-0.035, 0, 0],      // Rotation of the flap when the envelope is closed
    isOpen,
    letterPathArray,
    currentPage,
    } : AnimatedEnvelopeProps) {

    // Animates the envelope body rotation based on drag gestures with spring physics
    const [dragSpring, api] = useSpring(() => ({
        rotation: [0, 0, 0] as [number, number, number],
        config: { friction: bodyFriction, mass: bodyMass, tension: bodyTension },
      }));
    // Animates the envelope flap rotation based on open/close state with spring physics
    const flapSpring = useSpring({
    rotation: isOpen ? flapOpenRotation: flapClosedRotation,
    config: {friction: flapFriction, mass: flapMass, tension: flapTension, clamp: false},
    });


    const bind = useDrag(({ movement: [mx, my],down, memo }) => {
    // `active` is true when dragging, `down` is true when mouse is pressed
    // `movement` is the displacement from where the drag started
    // `memo` is a value that persists between drag events, we initialize it with the current rotation
    if (!memo) {
      const current = (dragSpring as any).rotation?.get
        ? (dragSpring as any).rotation.get()
        : ([0, 0, 0] as [number, number, number]);
      memo = current as [number, number, number];
    }
    api.start({
      rotation: [memo[0] + my / 100, memo[1] + mx / 100, 0],
    });
    return memo;
  }) as unknown as (...args: any[]) => any; // Type assertion to satisfy TypeScript

    return (
        <animated.group {...bind()} rotation={(dragSpring as any).rotation}>
            <EnvelopeBody 
            envelopeDepth={envelopeDepth} 
            envelopeHeight={envelopeHeight} 
            envelopeWidth={envelopeWidth}
            frontTexturePath={frontTexturePath}
            backTexturePath={backTexturePath} />
            <animated.group 
            rotation={(flapSpring as any).rotation}
            position={[0, envelopeHeight/2,  envelopeDepth / 2 + 0.005]}>
                <EnvelopeFlap 
                flapHeight={flapHeight} 
                envelopeWidth={envelopeWidth} 
                flapTexturePath={flapTexturePath}
                />
            </animated.group>
            <EnvelopeLetter
            letterPathArray={letterPathArray}
            isOpen={isOpen}
            currentPage={currentPage}
            envelopeWidth={envelopeWidth}
            envelopeHeight={envelopeHeight}
            />
        </animated.group>
    );    
}
