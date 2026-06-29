import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LoadingScreen } from '../../components/ui/LoadingScreen'
import { db } from '../../database'
import { useLiveQuery } from '../../hooks/useLiveQuery'

async function isOnboardingComplete(): Promise<boolean> {
  const [apiari, arnie] = await Promise.all([db.apiari.count(), db.arnie.count()])
  return apiari > 0 && arnie > 0
}

export function OnboardingGate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: complete, loading } = useLiveQuery(() => isOnboardingComplete(), [])

  useEffect(() => {
    if (loading) return
    if (!complete && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [complete, loading, location.pathname, navigate])

  if (loading) {
    return <LoadingScreen label="Caricamento…" />
  }

  if (!complete && location.pathname !== '/onboarding') {
    return <LoadingScreen label="Reindirizzamento…" />
  }

  return <Outlet />
}
