import { Route, Routes } from 'react-router-dom'
import { ReginePage } from './ReginePage'
import { ReginaDetailPage } from './ReginaDetailPage'

export function RegineRoutes() {
  return (
    <Routes>
      <Route index element={<ReginePage />} />
      <Route path=":id" element={<ReginaDetailPage />} />
    </Routes>
  )
}
