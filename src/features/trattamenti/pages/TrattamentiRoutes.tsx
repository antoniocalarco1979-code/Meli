import { Route, Routes } from 'react-router-dom'
import { TrattamentoDetailPage } from './TrattamentoDetailPage'
import { TrattamentiPage } from './TrattamentiPage'

export function TrattamentiRoutes() {
  return (
    <Routes>
      <Route index element={<TrattamentiPage />} />
      <Route path=":id" element={<TrattamentoDetailPage />} />
    </Routes>
  )
}
