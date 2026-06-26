import { Route, Routes } from 'react-router-dom'
import { ApiariPage } from './ApiariPage'
import { ApiarioDetailPage } from './ApiarioDetailPage'

export function ApiariRoutes() {
  return (
    <Routes>
      <Route index element={<ApiariPage />} />
      <Route path=":id" element={<ApiarioDetailPage />} />
    </Routes>
  )
}
