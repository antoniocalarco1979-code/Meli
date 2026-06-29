import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { NotFoundPage } from '../../components/common/NotFoundPage'
import { MainLayout } from '../../components/layout/MainLayout'
import { LoadingScreen } from '../../components/ui/LoadingScreen'
import { DashboardPage } from '../../features/dashboard'
import { OnboardingPage } from '../../features/onboarding/OnboardingPage'
import { DemoHubPage, DemoShell } from '../../demo'
import { OnboardingGate } from './OnboardingGate'

const ApiariRoutes = lazy(() =>
  import('../../features/apiari/pages/ApiariRoutes').then((m) => ({ default: m.ApiariRoutes })),
)
const ArnieRoutes = lazy(() =>
  import('../../features/arnie/pages/ArnieRoutes').then((m) => ({ default: m.ArnieRoutes })),
)
const VisiteRoutes = lazy(() =>
  import('../../features/visite/pages/VisiteRoutes').then((m) => ({ default: m.VisiteRoutes })),
)
const ReginePage = lazy(() =>
  import('../../features/regine/pages/ReginePage').then((m) => ({ default: m.ReginePage })),
)
const TrattamentiPage = lazy(() =>
  import('../../features/trattamenti/pages/TrattamentiPage').then((m) => ({ default: m.TrattamentiPage })),
)
const ProduzionePage = lazy(() =>
  import('../../features/produzione/pages/ProduzionePage').then((m) => ({ default: m.ProduzionePage })),
)
const MagazzinoPage = lazy(() =>
  import('../../features/magazzino/pages/MagazzinoPage').then((m) => ({ default: m.MagazzinoPage })),
)
const ReportPage = lazy(() =>
  import('../../features/report/pages/ReportPage').then((m) => ({ default: m.ReportPage })),
)
const OggiPage = lazy(() =>
  import('../../features/dashboard/pages/OggiPage').then((m) => ({ default: m.OggiPage })),
)
const AltroPage = lazy(() =>
  import('../../features/dashboard/pages/AltroPage').then((m) => ({ default: m.AltroPage })),
)

function PageLoader() {
  return <LoadingScreen label="Caricamento pagina…" />
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="demo" element={<DemoShell />}>
        <Route element={<MainLayout />}>
          <Route index element={<DemoHubPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="apiari/*" element={<LazyRoute><ApiariRoutes /></LazyRoute>} />
          <Route path="arnie/*" element={<LazyRoute><ArnieRoutes /></LazyRoute>} />
        </Route>
      </Route>
      <Route element={<OnboardingGate />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="oggi" element={<LazyRoute><OggiPage /></LazyRoute>} />
          <Route path="altro" element={<LazyRoute><AltroPage /></LazyRoute>} />
          <Route path="apiari/*" element={<LazyRoute><ApiariRoutes /></LazyRoute>} />
          <Route path="arnie/*" element={<LazyRoute><ArnieRoutes /></LazyRoute>} />
          <Route path="visite/*" element={<LazyRoute><VisiteRoutes /></LazyRoute>} />
          <Route path="regine" element={<LazyRoute><ReginePage /></LazyRoute>} />
          <Route path="trattamenti" element={<LazyRoute><TrattamentiPage /></LazyRoute>} />
          <Route path="produzione" element={<LazyRoute><ProduzionePage /></LazyRoute>} />
          <Route path="magazzino" element={<LazyRoute><MagazzinoPage /></LazyRoute>} />
          <Route path="report" element={<LazyRoute><ReportPage /></LazyRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
