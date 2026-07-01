import { useEffect, useState } from 'react'

export function useElapsedSeconds(startedAt: number, active = true): number {
  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
  )

  useEffect(() => {
    if (!active) {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
      return
    }

    const tick = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [active, startedAt])

  return elapsed
}
