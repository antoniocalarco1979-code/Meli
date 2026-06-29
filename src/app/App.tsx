import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { ToastContainer } from '../components/ui/Toast'
import { AppRouter } from './router'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
