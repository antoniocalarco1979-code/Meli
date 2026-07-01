import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseDexieError } from '../../../database/errors'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import { startGiroSession } from '../services/giroFlowService'

export function useStartGiroNavigation() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const toast = useToast()
  const [starting, setStarting] = useState(false)

  const launchGiro = useCallback(
    async (apiarioId: string, apiarioNome: string) => {
      if (starting) return false

      setStarting(true)
      try {
        const payload = await startGiroSession(apiarioId, apiarioNome)
        if (!payload) {
          toast.error('Nessuna arnia attiva da ispezionare in questo apiario')
          return false
        }

        navigate(appPath(`/arnie/${payload.firstArniaId}/visita`), {
          state: { giroReturn: payload.giroReturn, startNewSession: true },
        })
        return true
      } catch (err) {
        toast.error(parseDexieError(err))
        return false
      } finally {
        setStarting(false)
      }
    },
    [appPath, navigate, starting, toast],
  )

  return { launchGiro, starting }
}
