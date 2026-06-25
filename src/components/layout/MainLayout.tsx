import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__body">
        <Header />
        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
