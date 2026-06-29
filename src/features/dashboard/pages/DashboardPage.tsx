import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppPath } from '../../../demo/useAppPath'
import { useApiariStats } from '../../apiari/hooks/useApiari'
import { dashboardData, getWeatherVisitHint } from '../data/mockDashboard'
import { ApiarioSelectorModal } from '../components/ApiarioSelectorModal'
import { useDashboardFlow } from '../hooks/useDashboardLiveStats'
import { useDashboardLiveStats } from '../hooks/useDashboardLiveStats'
import { useSelectedApiario } from '../hooks/useSelectedApiario'
import { ApiaryMap } from '../components/ApiaryMap'
import { DashboardHeader } from '../components/DashboardHeader'
import { KpiGrid } from '../components/KpiGrid'
import { MorningBriefing } from '../components/MorningBriefing'
import { QuickActions } from '../components/QuickActions'
import { RanuWatermark } from '../components/RanuWatermark'
import { DashboardAzioniConsigliate } from '../components/DashboardAzioniConsigliate'
import { useApiarioAzioniConsigliate } from '../hooks/useApiarioAzioniConsigliate'
import { TodayActivities } from '../components/TodayActivities'
import { WeatherCard } from '../components/WeatherCard'
import './DashboardPage.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const { apiari, selectedApiario, selectedApiarioId, setSelectedApiarioId, loading: selecting } =
    useSelectedApiario()
  const { count, totalArnie } = useApiariStats()
  const { arnieByNumero, defaultArniaId, arnieCount, loading: flowLoading } =
    useDashboardFlow(selectedApiarioId)
  const { ultimaVisitaLabel, indiceSalute, trattamentiInScadenza, regineDaSostituire, loading: statsLoading } =
    useDashboardLiveStats(selectedApiarioId)

  const {
    userName,
    weather,
    kpis: baseKpis,
    hiveMarkers,
    todayActivities,
    quickActions,
  } = dashboardData

  const { azioni: azioniConsigliate, loading: azioniLoading } =
    useApiarioAzioniConsigliate(selectedApiarioId)

  const briefingLoading = selecting || flowLoading || statsLoading
  const selectedApiaryName = selectedApiario?.nome

  const kpis = useMemo(
    () =>
      baseKpis.map((kpi) => {
        if (kpi.id === '0') return { ...kpi, value: String(count) }
        if (kpi.id === '1') return { ...kpi, value: String(totalArnie) }
        if (kpi.id === '2') return { ...kpi, value: ultimaVisitaLabel }
        if (kpi.id === '4') return { ...kpi, value: `${indiceSalute}%` }
        if (kpi.id === '5') return { ...kpi, value: String(trattamentiInScadenza) }
        return kpi
      }),
    [baseKpis, count, totalArnie, ultimaVisitaLabel, indiceSalute, trattamentiInScadenza],
  )

  const goToApiario = () => {
    if (selectedApiarioId) navigate(appPath(`/apiari/${selectedApiarioId}`))
  }

  const goToArnia = (numero: string) => {
    const arniaId = arnieByNumero[numero]
    if (arniaId) navigate(appPath(`/arnie/${arniaId}`))
  }

  const goToDefaultArnia = () => {
    if (defaultArniaId) navigate(appPath(`/arnie/${defaultArniaId}`))
  }

  const goToNuovaVisita = () => {
    if (defaultArniaId) {
      navigate(appPath(`/arnie/${defaultArniaId}`), { state: { openVisita: true } })
    }
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
          <MorningBriefing
            userName={userName}
            totalArnie={arnieCount}
            trattamentiInScadenza={trattamentiInScadenza}
            regineDaSostituire={regineDaSostituire}
            weatherHint={getWeatherVisitHint(weather.condition)}
            loading={briefingLoading}
            selectedApiarioName={selectedApiaryName}
            onSelectApiario={() => setSelectorOpen(true)}
            onStartGiro={goToApiario}
          />

          <DashboardHeader
            selectedApiary={selectedApiaryName}
            onSelectApiario={() => setSelectorOpen(true)}
          />

          <section className="dashboard__top" aria-label="Meteo e indicatori">
            <WeatherCard {...weather} />
            <KpiGrid
              items={kpis}
              onApiariClick={() => navigate(appPath('/apiari'))}
              onArnieClick={() => navigate(appPath('/arnie'))}
            />
          </section>

          <section className="dashboard__middle" aria-label="Mappa e agenda">
            <ApiaryMap
              apiaryName={selectedApiaryName ?? 'Apiario'}
              markers={hiveMarkers}
              onHiveClick={goToArnia}
              onMapClick={goToApiario}
            />
            <TodayActivities
              activities={todayActivities}
              onActivityClick={(activity) => {
                const match = activity.title.match(/arnia\s+(\d+)/i)
                if (match) goToArnia(match[1])
              }}
            />
          </section>

          <DashboardAzioniConsigliate
            azioni={azioniConsigliate}
            loading={azioniLoading}
            onArniaClick={(arniaId) => navigate(appPath(`/arnie/${arniaId}`))}
          />

          <QuickActions
            actions={quickActions}
            onActionClick={(action) => {
              if (action.icon === 'arnia') goToDefaultArnia()
              if (action.icon === 'visit') goToNuovaVisita()
            }}
          />
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
