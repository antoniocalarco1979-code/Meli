import type { ReactNode } from 'react'
import { TelainoGridView } from './TelainoGridView'
import { TelainoPanel } from './TelainoPanel'
import type { TelainoVisitaRecord } from '../../types/telainoPanel.types'
import { useTelainoPanelSelection } from '../../hooks/useTelainoPanelSelection'
import './telaino-panel.css'

export type TelainoPanelHostProps = {
  telaini: TelainoVisitaRecord[]
  onSaveTelaino: (record: TelainoVisitaRecord) => void
  selectedTelainoId?: string | null
  panelOpen?: boolean
  onSelectTelaino?: (id: string) => void
  onClosePanel?: () => void
  header?: ReactNode
  className?: string
  layout?: 'grid' | 'nido-2d'
  closeOnSave?: boolean
}

export function TelainoPanelHost({
  telaini,
  onSaveTelaino,
  selectedTelainoId: controlledSelectedId,
  panelOpen: controlledPanelOpen,
  onSelectTelaino,
  onClosePanel,
  header,
  className = '',
  layout = 'grid',
  closeOnSave = false,
}: TelainoPanelHostProps) {
  const internal = useTelainoPanelSelection({ telaini })

  const selectedTelainoId = controlledSelectedId ?? internal.selectedTelainoId
  const panelOpen = controlledPanelOpen ?? internal.panelOpen
  const selectedTelaino =
    telaini.find((item) => item.id === selectedTelainoId) ?? internal.selectedTelaino

  const handleSelect = (telaino: TelainoVisitaRecord) => {
    if (onSelectTelaino) {
      onSelectTelaino(telaino.id)
    } else {
      internal.openTelaino(telaino.id)
    }
  }

  const handleClose = () => {
    if (onClosePanel) onClosePanel()
    else internal.closePanel()
  }

  const handleSave = (record: TelainoVisitaRecord) => {
    onSaveTelaino(record)
  }

  return (
    <div className={`telaino-panel-host${className ? ` ${className}` : ''}`}>
      {header}
      <TelainoGridView
        telaini={telaini}
        selectedTelainoId={selectedTelainoId}
        onTelainoClick={handleSelect}
        layout={layout}
      />
      <TelainoPanel
        open={panelOpen}
        telaino={selectedTelaino}
        onClose={handleClose}
        onSave={handleSave}
        closeOnSave={closeOnSave}
      />
    </div>
  )
}
