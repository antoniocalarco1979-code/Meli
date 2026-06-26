import { Navigate, Route, Routes } from 'react-router-dom'
import { VisitePage } from './VisitePage'

export function VisiteRoutes() {
  return (
    <Routes>
      <Route index element={<VisitePage />} />
      <Route path="nuova" element={<Navigate to="/arnie" replace />} />
    </Routes>
  )
}
