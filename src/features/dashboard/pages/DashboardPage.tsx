import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppPath } from '../../../demo/useAppPath'
import { useApiariStats } from '../../apiari/hooks/useApiari'
import { dashboardData } from '../data/mockDashboard'
import { ApiarioSelectorModal } from '../components/ApiarioSelectorModal'
import { useDashboardFlow } from '../hooks/useDashboardLiveStats'
import { useDashboardLiveStats } from '../hooks/useDashboardLiveStats'
import { useSelectedApiario } from '../hooks/useSelectedApiario'
import { DashboardLastActivity } from '../components/DashboardLastActivity'
import { DashboardStatCards } from '../components/DashboardStatCards'
import { DashboardTopBar } from '../components/DashboardTopBar'
import { DashboardWelcome } from '../components/DashboardWelcome'
import { RanuWatermark } from '../components/RanuWatermark'
import { MeliIntelligencePanel, useMeliIntelligence } from '../../intelligence'
import './DashboardPage.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const { apiari, selectedApiario, selectedApiarioId, setSelectedApiarioId, loading: selecting } =
    useSelectedApiario()
  const { count, totalArnie } = useApiariStats()
  const { arnieByNumero, loading: flowLoading } = useDashboardFlow(selectedApiarioId)
  const { ultimaVisitaLabel, trattamentiInScadenza, regineDaSostituire, loading: statsLoading } =
    useDashboardLiveStats(selectedApiarioId)

  const { userName, todayActivities } = dashboardData

  const { suggestions, loading: intelligenceLoading } = useMeliIntelligence(selectedApiarioId)

  const briefingLoading = selecting || flowLoading || statsLoading
  const selectedApiaryName = selectedApiario?.nome
  const visitePending = trattamentiInScadenza + regineDaSostituire

  const goToApiario = () => {
    if (selectedApiarioId) navigate(appPath(`/apiari/${selectedApiarioId}`))
  }

  const goToArnia = (numero: string) => {
    const arniaId = arnieByNumero[numero]
    if (arniaId) navigate(appPath(`/arnie/${arniaId}`))
  }

  return (
    <motion.main
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <RanuWatermark />

      <div className="dashboard__scroll">
        <div className="dashboard__inner">
          <DashboardTopBar />

          <DashboardWelcome
            userName={userName}
            selectedApiarioName={selectedApiaryName}
            loading={briefingLoading}
            onSelectApiario={() => setSelectorOpen(true)}
            onStartGiro={goToApiario}
          />

          <DashboardStatCards
            apiariCount={count}
            arnieCount={totalArnie}
            visitePending={visitePending}
            loading={briefingLoading}
            onApiariClick={() => navigate(appPath('/apiari'))}
            onArnieClick={() => navigate(appPath('/arnie'))}
            onVisiteClick={() => navigate(appPath('/visite'))}
          />

          <DashboardLastActivity
            ultimaVisitaLabel={ultimaVisitaLabel}
            activities={todayActivities}
            loading={briefingLoading}
            onActivityClick={(activity) => {
              const match = activity.title.match(/arnia\s+(\d+)/i)
              if (match) goToArnia(match[1])
            }}
          />

          <section className="dashboard__suggestions" aria-label="Suggerimenti MELI">
            <header className="dashboard__section-head">
              <h2 className="dashboard__section-title">Suggerimenti MELI</h2>
              <p className="dashboard__section-sub">
                Consigli personalizzati in base al tuo apiario
              </p>
            </header>
            <MeliIntelligencePanel
              suggestions={suggestions}
              loading={intelligenceLoading}
              onOpenArnia={(arniaId) => navigate(appPath(`/arnie/${arniaId}`))}
            />
          </section>
        </div>
      </div>

      <ApiarioSelectorModal
        open={selectorOpen}
        apiari={apiari}
        selectedId={selectedApiarioId}
        onClose={() => setSelectorOpen(false)}
        onSelect={(apiario) => void setSelectedApiarioId(apiario.id)}
      />
    </motion.main>
  )
}
