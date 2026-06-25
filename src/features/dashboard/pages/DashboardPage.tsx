import { motion } from 'framer-motion'
import { dashboardData } from '../data/mockDashboard'
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
  const {
    userName,
    subtitle,
    selectedApiary,
    apiaries,
    weather,
    kpis,
    hiveMarkers,
    todayActivities,
    quickActions,
  } = dashboardData

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
          />

          <section className="dashboard__top" aria-label="Meteo e indicatori">
            <WeatherCard {...weather} />
            <KpiGrid items={kpis} />
          </section>

          <section className="dashboard__middle" aria-label="Mappa e agenda">
            <ApiaryMap apiaryName={selectedApiary} markers={hiveMarkers} />
            <TodayActivities activities={todayActivities} />
          </section>

          <StartDayButton />

          <QuickActions actions={quickActions} />
        </div>
      </div>
    </motion.main>
  )
}
