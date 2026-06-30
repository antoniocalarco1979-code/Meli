import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
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

  const { userName, todayActivities, weather } = dashboardData
  const briefingLoading = selecting || flowLoading || statsLoading

  const goToApiario = () => {
    if (selectedApiarioId) {
      navigate(appPath(`/apiari/${selectedApiarioId}`), { state: { tab: 'giro' } })
    }
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
          loading={briefingLoading}
          selectedApiarioName={selectedApiario?.nome}
          onSelectApiario={() => setSelectorOpen(true)}
          onStartGiro={goToApiario}
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
        onSelect={(apiario) => void setSelectedApiarioId(apiario.id)}
      />
    </motion.div>
  )
}
