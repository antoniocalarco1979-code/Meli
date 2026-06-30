import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppPath } from '../../../demo/useAppPath'
import { dashboardData } from '../data/mockDashboard'
import { ApiarioSelectorModal } from '../components/ApiarioSelectorModal'
import { HomeApiariSection } from '../components/home/HomeApiariSection'
import { HomeAssistenteSection } from '../components/home/HomeAssistenteSection'
import { HomeHeader } from '../components/home/HomeHeader'
import { HomeIniziaGiroButton } from '../components/home/HomeIniziaGiroButton'
import { HomePrioritaCard } from '../components/home/HomePrioritaCard'
import { RanuWatermark } from '../components/RanuWatermark'
import { useHomeApiariCards } from '../hooks/useHomeApiariCards'
import { useHomePriorita } from '../hooks/useHomePriorita'
import { useSelectedApiario } from '../hooks/useSelectedApiario'
import { useMeliIntelligence } from '../../intelligence'
import './DashboardPage.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const { apiari, selectedApiarioId, setSelectedApiarioId, loading: selecting } =
    useSelectedApiario()
  const priorita = useHomePriorita(selectedApiarioId)
  const { cards, loading: apiariLoading } = useHomeApiariCards()
  const { suggestions, loading: intelligenceLoading } = useMeliIntelligence(selectedApiarioId)

  const { userName, weather } = dashboardData
  const loading = selecting || priorita.loading

  const handleStartGiro = () => {
    if (selectedApiarioId) {
      navigate(appPath(`/apiari/${selectedApiarioId}`), { state: { tab: 'giro' } })
      return
    }
    if (apiari.length === 1) {
      void setSelectedApiarioId(apiari[0].id).then(() => {
        navigate(appPath(`/apiari/${apiari[0].id}`), { state: { tab: 'giro' } })
      })
      return
    }
    setSelectorOpen(true)
  }

  const handleSelectApiario = (apiarioId: string) => {
    void setSelectedApiarioId(apiarioId).then(() => {
      navigate(appPath(`/apiari/${apiarioId}`), { state: { tab: 'giro' } })
    })
  }

  return (
    <motion.main
      className="dashboard home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <RanuWatermark />

      <div className="dashboard__scroll">
        <div className="dashboard__inner">
          <HomeHeader userName={userName} weather={weather} loading={loading} />

          <HomePrioritaCard {...priorita} />

          <HomeIniziaGiroButton onClick={handleStartGiro} disabled={loading} />

          <HomeApiariSection
            cards={cards}
            loading={apiariLoading}
            onOpen={(apiarioId) => navigate(appPath(`/apiari/${apiarioId}`))}
          />

          <HomeAssistenteSection
            suggestion={suggestions[0]}
            loading={intelligenceLoading}
          />
        </div>
      </div>

      <ApiarioSelectorModal
        open={selectorOpen}
        apiari={apiari}
        selectedId={selectedApiarioId}
        onClose={() => setSelectorOpen(false)}
        onSelect={(apiario) => handleSelectApiario(apiario.id)}
      />
    </motion.main>
  )
}
