import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/index.css'
import App from './app/App'
import { ensureWorkspaceSeeded } from './demo/ensureWorkspaceSeeded'
import { initializeDatabase } from './database/initializeDatabase'
import { registerPwa } from './pwa/registerPwa'

registerPwa()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

const root = createRoot(rootElement)

async function bootstrap() {
  try {
    await initializeDatabase()
    await ensureWorkspaceSeeded()
  } catch (err) {
    console.warn('[MELI] Bootstrap database:', err)
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
