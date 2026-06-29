import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/index.css'
import App from './app/App'
import { registerPwa } from './pwa/registerPwa'

registerPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
