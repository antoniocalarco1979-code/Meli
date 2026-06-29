import { useEffect, useMemo, useState } from 'react'
import { IspezioneHeader } from '../ispezione-engine/IspezioneHeader'
import { ArniaGraphic } from './ArniaGraphic'
import { createMockArniaDesign } from './mockArniaDesignData'
import { TelainoPanel } from './TelainoPanel'
import type { TelainoDesignData } from './types'
import '../visit-engine/visit-engine.css'
import '../ispezione-engine/ispezione-engine.css'
import './arnia-design.css'

type ArniaDesignVisitProps = {
  arniaNumero: string
  onClose: () => void
}

export function ArniaDesignVisit({ arniaNumero, onClose }: ArniaDesignVisitProps) {
  const initialMock = useMemo(() => createMockArniaDesign(arniaNumero), [arniaNumero])
  const [telai, setTelai] = useState<TelainoDesignData[]>(initialMock.telai)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const selectedTelaino = telai.find((t) => t.id === selectedId) ?? null

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleSelectTelaino = (id: string) => {
    setSelectedId(id)
    setPanelOpen(true)
  }

  const handleClosePanel = () => {
    setPanelOpen(false)
    setSelectedId(null)
  }

  const handleChangeTelaino = (patch: Partial<TelainoDesignData>) => {
    if (!selectedId) return
    setTelai((prev) => prev.map((t) => (t.id === selectedId ? { ...t, ...patch } : t)))
  }

  const handleSaveTelaino = () => {
    if (!selectedId) return
    setTelai((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, status: 'inspected' } : t)),
    )
    setPanelOpen(false)
    setSelectedId(null)
  }

  return (
    <div className="arnia-design-visit" role="dialog" aria-modal="true" aria-label="Prototipo ispezione arnia">
      <IspezioneHeader arniaNumero={arniaNumero} onClose={onClose} />

      <div className="arnia-design-visit__badge">Prototipo UX — dati temporanei</div>

      <div className="arnia-design-visit__body">
        <ArniaGraphic
          telai={telai}
          selectedId={selectedId}
          onSelectTelaino={handleSelectTelaino}
        />
      </div>

      <TelainoPanel
        open={panelOpen}
        telaino={selectedTelaino}
        onClose={handleClosePanel}
        onChange={handleChangeTelaino}
        onSave={handleSaveTelaino}
      />
    </div>
  )
}
