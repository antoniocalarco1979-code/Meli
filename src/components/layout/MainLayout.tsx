import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import './BottomNav.css'
import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="main-layout main-layout--with-bottom-nav">
      <Sidebar />
      <div className="main-layout__body">
        <Header />
        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
