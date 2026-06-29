import { Route, Routes } from 'react-router-dom'
import { VisitWizardPage } from '../../visite/pages/VisitWizardPage'
import { ArniaDetailPage } from './ArniaDetailPage'
import { ArniePage } from './ArniePage'

export function ArnieRoutes() {
  return (
    <Routes>
      <Route index element={<ArniePage />} />
      <Route path=":id/visita" element={<VisitWizardPage />} />
      <Route path=":id" element={<ArniaDetailPage />} />
    </Routes>
  )
}
