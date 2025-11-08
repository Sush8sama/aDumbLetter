import EnvelopePage from "./EnvelopePage";

/**
 * Placeholder page for a dumb letter envelope.
 */

export default function DumbLetterPage () {
    return (
      <EnvelopePage
        frontTexturePath={'/textures/FrontLetterWO.png'}
        backTexturePath={'/textures/BackLetter.png'}
        flapTexturePath={'/textures/FrontFlapOut.png'}
        letterPathArray={[
          '/textures/Letter1.png',
          '/textures/Letter2.png',
          '/textures/Letter3.png',
          '/textures/Letter4.png',
          '/textures/Letter5.png',
          '/textures/Letter6.png',
          '/textures/Letter7.png',
          '/textures/Letter8.png',
        ]}
      />
    );
  }