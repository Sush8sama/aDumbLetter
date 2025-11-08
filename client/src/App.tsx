import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Router from './routers/Router';


/**
 * webapp pages. Could rename this to pages or something instead of App XD.
 * Routes between envelope page and letter writer page based on current path.
 */
  console.log(
    "%c App version %c " + (import.meta.env.VITE_APP_VERSION || "1.0") + " ",
    "background: #222; color: #bada55; font-weight: bold; padding: 2px 4px; border-radius: 2px;",
    "background: #555555ff; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 2px;"
  );
export default function App() {
  return(
    <AuthProvider>
      <BrowserRouter>
       <Router/>
      </BrowserRouter>
    </AuthProvider>
 );
}

