
import {Suspense, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import AnimatedEnvelope from '../components/AnimatedEnvelope';
import './EnvelopePage.css';

type EnvelopePageProps = {
    frontTexturePath: string,
    backTexturePath: string,
    flapTexturePath: string,
    letterPathArray: string[],
};

/**
 * Given textures it will display an interactable and animated envelope with its contents.
 * [TBA] Could make the background change or other customazations later.
 */
export default function EnvelopePage({
    frontTexturePath,
    backTexturePath,
    flapTexturePath,
    letterPathArray,
}: EnvelopePageProps){

    const [isOpen, setIsOpen] = useState(false);           // Envelope open and close state
    const [currentPage, setCurrentPage] = useState(0);     // Current page of the letter being viewed
    const pageCount = letterPathArray.length;              // Total number of pages in the letter

    // Handlers for next and previous page buttons
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

    return(
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
            <AnimatedEnvelope 
            frontTexturePath={frontTexturePath} 
            backTexturePath={backTexturePath}
            flapTexturePath={flapTexturePath}
            isOpen= {isOpen}
            letterPathArray={letterPathArray}
            currentPage={currentPage} />
        </Suspense>
      </Canvas>
    </div>
      </>
    );
}
