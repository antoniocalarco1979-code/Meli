import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppPath } from '../../../demo/useAppPath'
import { useStartGiroNavigation } from '../../visite/hooks/useStartGiroNavigation'
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
  const { launchGiro, starting: giroStarting } = useStartGiroNavigation()

  const { userName, weather } = dashboardData
  const loading = selecting || priorita.loading

  const handleStartGiro = () => {
    if (selectedApiarioId) {
      const apiario = apiari.find((item) => item.id === selectedApiarioId)
      void launchGiro(selectedApiarioId, apiario?.nome ?? 'Apiario')
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
      void launchGiro(apiarioId, apiario?.nome ?? 'Apiario')
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

          <HomeIniziaGiroButton onClick={handleStartGiro} disabled={loading || giroStarting} />

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
