import EnvelopePage from './pages/EnvelopePage';
import LetterWriterPage from './pages/LetterWriterPage';



/**
 * webapp pages. Could rename this to pages or something instead of App XD.
 * Currently just two pages and no logic to switch between them yet.
 */
export default function App() {

  return (

    /** -- Letter Writer Page --  */
    <LetterWriterPage />

    /** -- Envelope Page --  */
    // <EnvelopePage
    // frontTexturePath={'/textures/FrontLetterWO.png'}
    // backTexturePath={'/textures/BackLetter.png'}
    // flapTexturePath={'/textures/FrontFlapOut.png'}
    // letterPathArray={[
    //   '/textures/Letter1.png',
    //   '/textures/Letter2.png',
    //   '/textures/Letter3.png',
    //   '/textures/Letter4.png',
    //   '/textures/Letter5.png',
    //   '/textures/Letter6.png',
    //   '/textures/Letter7.png',
    //   '/textures/Letter8.png',
    // ]}
    // />
  );
}


