import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root');
const root = createRoot(container!); // The '!' asserts that the container is not null

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);