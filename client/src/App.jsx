import EnvelopePage from './pages/EnvelopePage';
import LetterWriterPage from './pages/LetterWriterPage';



/**
 * webapp pages. Could rename this to pages or something instead of App XD.
 * Routes between envelope page and letter writer page based on current path.
 */
export default function App() {
  const currentPath = window.location.pathname;

  // Show envelope page for /letter1
  if (currentPath === '/letter1') {
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

  // Show letter writer page for /newletter
  if (currentPath === '/newletter') {
    return <LetterWriterPage />;
  }

  // Default fallback
  return <LetterWriterPage />;
}


