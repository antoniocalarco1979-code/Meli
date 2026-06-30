import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  initializeDatabase,
  isOnboardingComplete,
  readOnboardingCounts,
} from '../../database/initializeDatabase'

/**
 * Non blocca mai l'app con uno spinner fullscreen.
 * Controlla onboarding in background e reindirizza se necessario.
 */
export function OnboardingGate() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        await initializeDatabase()
        const counts = await readOnboardingCounts()
        if (cancelled) return

        if (!isOnboardingComplete(counts) && location.pathname !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        }
      } catch (err) {
        console.error('[MELI] OnboardingGate:', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [location.pathname, navigate])

  return <Outlet />
}
