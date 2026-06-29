import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { setDatabaseMode } from '../database'
import { seedDemoDatabaseIfEmpty } from './seedDemoDatabase'
import { DemoBanner } from './DemoBanner'
import './demo.css'

export function DemoShell() {
  useEffect(() => {
    setDatabaseMode('demo')
    void seedDemoDatabaseIfEmpty()

    return () => {
      setDatabaseMode('production')
    }
  }, [])

  return (
    <div className="demo-shell">
      <DemoBanner />
      <Outlet />
    </div>
  )
}
