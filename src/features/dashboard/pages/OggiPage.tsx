import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import { useStartGiroNavigation } from '../../visite/hooks/useStartGiroNavigation'
import { ApiarioSelectorModal } from '../components/ApiarioSelectorModal'
import { MorningBriefing } from '../components/MorningBriefing'
import { TodayActivities } from '../components/TodayActivities'
import { dashboardData, getWeatherVisitHint } from '../data/mockDashboard'
import { useDashboardFlow, useDashboardLiveStats } from '../hooks/useDashboardLiveStats'
import { useSelectedApiario } from '../hooks/useSelectedApiario'
import './OggiPage.css'

export function OggiPage() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const { apiari, selectedApiario, selectedApiarioId, setSelectedApiarioId, loading: selecting } =
    useSelectedApiario()
  const { arnieByNumero, arnieCount, loading: flowLoading } = useDashboardFlow(selectedApiarioId)
  const { trattamentiInScadenza, regineDaSostituire, loading: statsLoading } =
    useDashboardLiveStats(selectedApiarioId)
  const { launchGiro, starting: giroStarting } = useStartGiroNavigation()

  const { userName, todayActivities, weather } = dashboardData
  const briefingLoading = selecting || flowLoading || statsLoading

  const handleStartGiro = () => {
    if (selectedApiarioId && selectedApiario) {
      void launchGiro(selectedApiarioId, selectedApiario.nome)
      return
    }
    if (apiari.length === 1) {
      void setSelectedApiarioId(apiari[0].id).then(() => {
        void launchGiro(apiari[0].id, apiari[0].nome)
      })
      return
    }
    setSelectorOpen(true)
  }

  const handleSelectApiario = (apiarioId: string) => {
    const apiario = apiari.find((item) => item.id === apiarioId)
    void setSelectedApiarioId(apiarioId).then(() => {
      if (apiario) void launchGiro(apiarioId, apiario.nome)
    })
  }

  const goToArnia = (numero: string) => {
    const arniaId = arnieByNumero[numero]
    if (arniaId) navigate(appPath(`/arnie/${arniaId}`))
  }

  return (
    <motion.div
      className="oggi-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="oggi-page__inner">
        <MorningBriefing
          userName={userName}
          totalArnie={arnieCount}
          trattamentiInScadenza={trattamentiInScadenza}
          regineDaSostituire={regineDaSostituire}
          weatherHint={getWeatherVisitHint(weather.condition)}
          loading={briefingLoading || giroStarting}
          selectedApiarioName={selectedApiario?.nome}
          onSelectApiario={() => setSelectorOpen(true)}
          onStartGiro={handleStartGiro}
        />

        <TodayActivities
          activities={todayActivities}
          onActivityClick={(activity) => {
            const match = activity.title.match(/arnia\s+(\d+)/i)
            if (match) goToArnia(match[1])
          }}
        />
      </div>

      <ApiarioSelectorModal
        open={selectorOpen}
        apiari={apiari}
        selectedId={selectedApiarioId}
        onClose={() => setSelectorOpen(false)}
        onSelect={(apiario) => handleSelectApiario(apiario.id)}
      />
    </motion.div>
  )
}
