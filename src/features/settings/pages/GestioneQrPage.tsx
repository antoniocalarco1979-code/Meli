import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { useAppPath } from '../../../demo/useAppPath'
import { getAllApiari } from '../../../database/services/apiariService'
import { getAllArnie } from '../../../database/services/arnieService'
import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'
import { ArniaQrSection } from '../../arnie/components/qr/ArniaQrSection'
import './GestioneQrPage.css'

export function GestioneQrPage() {
  const appPath = useAppPath()
  const { data, loading, error } = useLiveQuery(
    async () => {
      const [arnie, apiari] = await Promise.all([getAllArnie(), getAllApiari()])
      const apiarioById = new Map(apiari.map((apiario) => [apiario.id, apiario.nome]))
      return arnie
        .map((arnia) => ({
          arnia,
          apiarioNome: apiarioById.get(arnia.apiarioId) ?? 'Apiario',
        }))
        .sort((a, b) => a.arnia.numero.localeCompare(b.arnia.numero, undefined, { numeric: true }))
    },
    [],
    { seed: ensureWorkspaceSeeded },
  )

  const items = data ?? []
  const [selectedId, setSelectedId] = useState<string>()

  const selected = useMemo(
    () => items.find((item) => item.arnia.id === selectedId) ?? items[0],
    [items, selectedId],
  )

  return (
    <PageQueryState loading={loading} error={error} skeleton="detail">
      <div className="gestione-qr-page">
        <div className="gestione-qr-page__inner">
          <Link to={appPath('/impostazioni')} className="gestione-qr-page__back">
            <ArrowLeft size={20} aria-hidden="true" />
            Impostazioni
          </Link>

          <header className="gestione-qr-page__hero meli-glass meli-glass--deep">
            <h1 className="gestione-qr-page__title">📱 Gestione QR</h1>
            <p className="gestione-qr-page__subtitle">
              Visualizza, rigenera e ristampa i QR Code di tutte le arnie.
            </p>
          </header>

          {items.length === 0 ? (
            <p className="gestione-qr-page__empty meli-glass">
              Nessuna arnia presente. Crea un&apos;apiario e aggiungi la prima arnia per generare i QR
              Code.
            </p>
          ) : (
            <div className="gestione-qr-page__layout">
              <section className="gestione-qr-page__list-wrap meli-glass meli-glass--deep" aria-label="Elenco arnie">
                <h2 className="gestione-qr-page__list-title">Arnie</h2>
                <ul className="gestione-qr-page__list">
                  {items.map(({ arnia, apiarioNome }) => {
                    const active = selected?.arnia.id === arnia.id
                    return (
                      <li key={arnia.id}>
                        <button
                          type="button"
                          className={`gestione-qr-page__list-item${active ? ' gestione-qr-page__list-item--active' : ''}`}
                          onClick={() => setSelectedId(arnia.id)}
                        >
                          <span className="gestione-qr-page__list-num">N. {arnia.numero}</span>
                          <span className="gestione-qr-page__list-name">
                            {arnia.nome?.trim() || 'Senza nome'}
                          </span>
                          <span className="gestione-qr-page__list-apiario">{apiarioNome}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>

              {selected && (
                <ArniaQrSection
                  key={selected.arnia.id}
                  arnia={selected.arnia}
                  apiarioNome={selected.apiarioNome}
                  showRegenerate
                />
              )}
            </div>
          )}
        </div>
      </div>
    </PageQueryState>
  )
}
