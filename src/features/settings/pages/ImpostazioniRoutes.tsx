import { Route, Routes } from 'react-router-dom'
import { ImpostazioniPage } from './ImpostazioniPage'
import { GestioneQrPage } from './GestioneQrPage'

export function ImpostazioniRoutes() {
  return (
    <Routes>
      <Route index element={<ImpostazioniPage />} />
      <Route path="gestione-qr" element={<GestioneQrPage />} />
    </Routes>
  )
}
