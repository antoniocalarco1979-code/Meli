import { Route, Routes } from 'react-router-dom'
import { NuovaSmielaturaPage } from './NuovaSmielaturaPage'
import { StoricoProduzionePage } from './StoricoProduzionePage'

export function ProduzioneRoutes() {
  return (
    <Routes>
      <Route index element={<StoricoProduzionePage />} />
      <Route path="nuova" element={<NuovaSmielaturaPage />} />
    </Routes>
  )
}
