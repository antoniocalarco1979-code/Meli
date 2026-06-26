import { Route, Routes } from 'react-router-dom'
import { ArniaDetailPage } from './ArniaDetailPage'
import { ArniePage } from './ArniePage'

export function ArnieRoutes() {
  return (
    <Routes>
      <Route index element={<ArniePage />} />
      <Route path=":id" element={<ArniaDetailPage />} />
    </Routes>
  )
}
