
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import EnvelopeBody from './EnvelopeBody';
import EnvelopeFlap from './EnvelopeFlap';
import EnvelopeLetter from './EnvelopeLetter';


function AnimatedEnvelope({
    bodyFriction = 200,
    bodyMass = 15,
    bodyTension = 1000,
    flapFriction = 200,
    flapMass = 1,
    flapTension = 500,
    frontTexturePath,
    backTexturePath,
    flapTexturePath,
    flapHeight = 1.5,
    envelopeWidth = 3,
    envelopeHeight = 2,
    envelopeDepth = 0.01,
    flapOpenRotation = [-Math.PI, 0, 0],
    flapClosedRotation = [-0.035, 0, 0],
    isOpen,
    letterArray,
    currentPage,
    }) {

    const [dragSpring, api] = useSpring(() => ({
        rotation: [0, 0, 0],
        config: { friction: bodyFriction, mass: bodyMass, tension: bodyTension },
      }));

    const {rotation: flapSpring} = useSpring({
    rotation: isOpen ? flapOpenRotation: flapClosedRotation,
    config: {friction: flapFriction, mass: flapMass, tension: flapTension, clamp: false},
    });


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

    return (
        <animated.group {...bind()} {...dragSpring}>
            <EnvelopeBody 
            envelopeDepth={envelopeDepth} 
            envelopeHeight={envelopeHeight} 
            envelopeWidth={envelopeWidth}
            frontTexturePath={frontTexturePath}
            backTexturePath={backTexturePath} />
            <animated.group 
            rotation={flapSpring}
            position={[0, envelopeHeight/2,  envelopeDepth / 2 + 0.005]}>
                <EnvelopeFlap 
                flapHeight={flapHeight} 
                envelopeWidth={envelopeWidth} 
                flapTexturePath={flapTexturePath}
                x={x} y={y} z={z}
                />
            </animated.group>
            <EnvelopeLetter
            letterArray={letterArray}
            isOpen={isOpen}
            currentPage={currentPage}
            envelopeWidth={envelopeWidth}
            envelopeHeight={envelopeHeight}
            />
        </animated.group>
    );    
}