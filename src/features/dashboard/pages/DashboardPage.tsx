import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApiariStats } from '../../apiari/hooks/useApiari'
import { dashboardData } from '../data/mockDashboard'
import { useDashboardFlow } from '../hooks/useDashboardFlow'
import { useDashboardLiveStats } from '../hooks/useDashboardLiveStats'
import { ApiaryMap } from '../components/ApiaryMap'
import { DashboardHeader } from '../components/DashboardHeader'
import { KpiGrid } from '../components/KpiGrid'
import { QuickActions } from '../components/QuickActions'
import { RanuWatermark } from '../components/RanuWatermark'
import { StartDayButton } from '../components/StartDayButton'
import { TodayActivities } from '../components/TodayActivities'
import { WeatherCard } from '../components/WeatherCard'
import './DashboardPage.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const { count, totalArnie, names } = useApiariStats()
  const { primaryApiarioId, arnieByNumero, defaultArniaId } = useDashboardFlow()
  const { ultimaVisitaLabel, indiceSalute } = useDashboardLiveStats()

  const {
    userName,
    subtitle,
    weather,
    kpis: baseKpis,
    hiveMarkers,
    todayActivities,
    quickActions,
  } = dashboardData

  const apiaries = names.length > 0 ? names : dashboardData.apiaries
  const selectedApiary = apiaries[0] ?? dashboardData.selectedApiary

  const kpis = useMemo(
    () =>
      baseKpis.map((kpi) => {
        if (kpi.id === '0') return { ...kpi, value: String(count) }
        if (kpi.id === '1') return { ...kpi, value: String(totalArnie) }
        if (kpi.id === '2') return { ...kpi, value: ultimaVisitaLabel }
        if (kpi.id === '4') return { ...kpi, value: `${indiceSalute}%` }
        return kpi
      }),
    [baseKpis, count, totalArnie, ultimaVisitaLabel, indiceSalute],
  )

  const goToApiario = () => {
    if (primaryApiarioId) navigate(`/apiari/${primaryApiarioId}`)
  }

  const goToArnia = (numero: string) => {
    const arniaId = arnieByNumero[numero]
    if (arniaId) navigate(`/arnie/${arniaId}`)
  }

  const goToNuovaVisita = () => {
    if (defaultArniaId) {
      navigate(`/arnie/${defaultArniaId}`, { state: { openVisita: true } })
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
          <DashboardHeader
            userName={userName}
            subtitle={subtitle}
            selectedApiary={selectedApiary}
            apiaries={apiaries}
            onApiaryOpen={goToApiario}
          />

          <section className="dashboard__top" aria-label="Meteo e indicatori">
            <WeatherCard {...weather} />
            <KpiGrid
              items={kpis}
              onApiariClick={() => navigate('/apiari')}
              onArnieClick={() => navigate('/arnie')}
            />
          </section>

          <section className="dashboard__middle" aria-label="Mappa e agenda">
            <ApiaryMap
              apiaryName={selectedApiary}
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

          <StartDayButton onClick={goToApiario} />

          <QuickActions
            actions={quickActions}
            onActionClick={(action) => {
              if (action.icon === 'visit') goToNuovaVisita()
            }}
          />
        </div>
      </div>
    </motion.main>
  )
}
