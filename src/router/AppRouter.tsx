import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { Loading } from '../components/ui/Loading'
import { DashboardPage } from '../features/dashboard'

const ApiariRoutes = lazy(() =>
  import('../features/apiari/pages/ApiariRoutes').then((m) => ({ default: m.ApiariRoutes })),
)
const ArnieRoutes = lazy(() =>
  import('../features/arnie/pages/ArnieRoutes').then((m) => ({ default: m.ArnieRoutes })),
)
const VisiteRoutes = lazy(() =>
  import('../features/visite/pages/VisiteRoutes').then((m) => ({ default: m.VisiteRoutes })),
)
const ReginePage = lazy(() =>
  import('../features/regine/pages/ReginePage').then((m) => ({ default: m.ReginePage })),
)
const TrattamentiPage = lazy(() =>
  import('../features/trattamenti/pages/TrattamentiPage').then((m) => ({ default: m.TrattamentiPage })),
)
const ProduzionePage = lazy(() =>
  import('../features/produzione/pages/ProduzionePage').then((m) => ({ default: m.ProduzionePage })),
)
const MagazzinoPage = lazy(() =>
  import('../features/magazzino/pages/MagazzinoPage').then((m) => ({ default: m.MagazzinoPage })),
)
const ReportPage = lazy(() =>
  import('../features/report/pages/ReportPage').then((m) => ({ default: m.ReportPage })),
)

function PageLoader() {
  return <Loading size="lg" />
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="apiari/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <ApiariRoutes />
            </Suspense>
          }
        />
        <Route
          path="arnie/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <ArnieRoutes />
            </Suspense>
          }
        />
        <Route
          path="visite/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <VisiteRoutes />
            </Suspense>
          }
        />
        <Route
          path="regine"
          element={
            <Suspense fallback={<PageLoader />}>
              <ReginePage />
            </Suspense>
          }
        />
        <Route
          path="trattamenti"
          element={
            <Suspense fallback={<PageLoader />}>
              <TrattamentiPage />
            </Suspense>
          }
        />
        <Route
          path="produzione"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProduzionePage />
            </Suspense>
          }
        />
        <Route
          path="magazzino"
          element={
            <Suspense fallback={<PageLoader />}>
              <MagazzinoPage />
            </Suspense>
          }
        />
        <Route
          path="report"
          element={
            <Suspense fallback={<PageLoader />}>
              <ReportPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
