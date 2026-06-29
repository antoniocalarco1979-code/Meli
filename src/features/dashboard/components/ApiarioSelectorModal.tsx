import { MapPin } from '../../../theme/icons'
import { Modal } from '../../../components/ui/Modal'
import type { ApiarioView } from '../../apiari/types'
import './ApiarioSelectorModal.css'

type ApiarioSelectorModalProps = {
  open: boolean
  apiari: ApiarioView[]
  selectedId?: string
  onClose: () => void
  onSelect: (apiario: ApiarioView) => void
}

export function ApiarioSelectorModal({
  open,
  apiari,
  selectedId,
  onClose,
  onSelect,
}: ApiarioSelectorModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Seleziona apiario">
      <ul className="apiario-selector" role="listbox" aria-label="Lista apiari">
        {apiari.map((apiario) => {
          const active = apiario.id === selectedId

          return (
            <li key={apiario.id}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                className={`apiario-selector__item${active ? ' apiario-selector__item--active' : ''}`}
                onClick={() => {
                  onSelect(apiario)
                  onClose()
                }}
              >
                <span className="apiario-selector__icon" aria-hidden="true">
                  <MapPin size={22} strokeWidth={1.75} />
                </span>
                <span className="apiario-selector__body">
                  <span className="apiario-selector__name">{apiario.nome}</span>
                  {apiario.localita && (
                    <span className="apiario-selector__meta">{apiario.localita}</span>
                  )}
                </span>
                <span className="apiario-selector__count">
                  {apiario.numeroArnie} {apiario.numeroArnie === 1 ? 'arnia' : 'arnie'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
