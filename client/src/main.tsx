import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import Router from './Router'

// Get the root element
const container = document.getElementById('root')!

// Create root only if it doesn't exist (for HMR compatibility)
if (!(container as any)._reactRootContainer) {
  const root = createRoot(container)
  ;(container as any)._reactRootContainer = root
}

// Render the app
;(container as any)._reactRootContainer.render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
)
