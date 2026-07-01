import { useEffect } from 'react'
import { liveQuery } from 'dexie'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getDb } from '../../database/activeDatabase'
import { isOnboardingComplete } from '../../database/initializeDatabase'

/**
 * Non blocca mai l'app con uno spinner fullscreen.
 * Usa liveQuery per i conteggi (zona Dexie corretta, niente count() fuori transazione).
 */
export function OnboardingGate() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let cancelled = false

    const subscription = liveQuery(async () => {
      const database = getDb()
      const apiari = await database.apiari.count()
      const arnie = await database.arnie.count()
      return { apiari, arnie }
    }).subscribe({
      next: (counts) => {
        if (cancelled) return
        if (!isOnboardingComplete(counts) && location.pathname !== '/onboarding') {
          navigate('/onboarding', { replace: true })
        }
      },
      error: (err) => {
        console.warn('[MELI] OnboardingGate:', err)
      },
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [location.pathname, navigate])

  return <Outlet />
}
