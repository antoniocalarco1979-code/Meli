import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Droplets,
  Flower2,
  Hexagon,
  MapPin,
  Mountain,
  Pencil,
  Signpost,
  Sun,
  Users,
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { ApiarioDetailView } from '../services/apiarioDetailService'
import {
  formatAccessibilita,
  formatAltitudine,
  formatEsposizione,
  formatGps,
  formatPresenzaAcqua,
} from '../utils/apiarioFieldFormatters'
import { ApiarioDetailMap } from './ApiarioDetailMap'
import './ApiarioInfoSection.css'

type ApiarioInfoSectionProps = {
  detail: ApiarioDetailView
  onEdit?: () => void
  actions?: ReactNode
}

function InfoRow({
  icon,
  label,
  value,
  wide,
}: {
  icon: ReactNode
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={`apiario-info__row${wide ? ' apiario-info__row--wide' : ''}`}>
      <dt>
        {icon}
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  )
}

export function ApiarioInfoSection({ detail, onEdit, actions }: ApiarioInfoSectionProps) {
  const { apiario, arnieCount, famiglieCount } = detail
  const hasGps = apiario.latitudine != null && apiario.longitudine != null

  return (
    <motion.section
      className="apiario-info"
      aria-labelledby="apiario-info-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="apiario-info__hero meli-glass meli-glass--deep">
        {apiario.foto ? (
          <img src={apiario.foto} alt="" className="apiario-info__photo" />
        ) : (
          <div className="apiario-info__photo-placeholder">Nessuna foto</div>
        )}

        <div className="apiario-info__hero-body">
          <div className="apiario-info__hero-top">
            <div>
              <p className="apiario-info__eyebrow meli-label">Informazioni</p>
              <h1 id="apiario-info-title" className="apiario-info__title">
                {apiario.nome}
              </h1>
            </div>
            {onEdit && (
              <Button variant="secondary" size="md" onClick={onEdit}>
                <Pencil size={18} aria-hidden="true" />
                Modifica
              </Button>
            )}
          </div>

          <dl className="apiario-info__quick">
            <div>
              <dt>Arnie</dt>
              <dd>{arnieCount}</dd>
            </div>
            <div>
              <dt>Famiglie</dt>
              <dd>{famiglieCount}</dd>
            </div>
          </dl>
        </div>
      </div>

      {hasGps && (
        <ApiarioDetailMap
          latitudine={apiario.latitudine!}
          longitudine={apiario.longitudine!}
          nome={apiario.nome}
        />
      )}

      <div className="apiario-info__grid meli-glass meli-glass--deep">
        <h2 className="apiario-info__section-title">Posizione</h2>
        <dl className="apiario-info__rows">
          <InfoRow
            icon={<MapPin size={18} aria-hidden="true" />}
            label="GPS"
            value={formatGps(apiario.latitudine, apiario.longitudine)}
            wide
          />
          <InfoRow icon={<MapPin size={18} aria-hidden="true" />} label="Comune" value={apiario.comune?.trim() || '—'} />
          <InfoRow icon={<MapPin size={18} aria-hidden="true" />} label="Provincia" value={apiario.provincia?.trim() || '—'} />
          <InfoRow icon={<MapPin size={18} aria-hidden="true" />} label="Regione" value={apiario.regione?.trim() || '—'} />
          <InfoRow
            icon={<Mountain size={18} aria-hidden="true" />}
            label="Altitudine"
            value={formatAltitudine(apiario.quota)}
          />
          <InfoRow
            icon={<Signpost size={18} aria-hidden="true" />}
            label="Accessibilità"
            value={formatAccessibilita(apiario.accessibilita)}
            wide={!!apiario.indirizzo}
          />
          {apiario.indirizzo && (
            <InfoRow
              icon={<Signpost size={18} aria-hidden="true" />}
              label="Punto accesso"
              value={apiario.indirizzo}
              wide
            />
          )}
        </dl>
      </div>

      <div className="apiario-info__grid meli-glass meli-glass--deep">
        <h2 className="apiario-info__section-title">Ambiente</h2>
        <dl className="apiario-info__rows">
          <InfoRow
            icon={<Sun size={18} aria-hidden="true" />}
            label="Esposizione"
            value={formatEsposizione(apiario.esposizione)}
          />
          <InfoRow
            icon={<Droplets size={18} aria-hidden="true" />}
            label="Presenza acqua"
            value={formatPresenzaAcqua(apiario.presenzaAcqua)}
          />
          <InfoRow
            icon={<Flower2 size={18} aria-hidden="true" />}
            label="Fioritura prevalente"
            value={apiario.fiorituraPrevalente?.trim() || '—'}
            wide
          />
        </dl>
      </div>

      <div className="apiario-info__grid meli-glass meli-glass--deep">
        <h2 className="apiario-info__section-title">Colonie</h2>
        <dl className="apiario-info__rows">
          <InfoRow
            icon={<Hexagon size={18} aria-hidden="true" />}
            label="Numero arnie"
            value={String(arnieCount)}
          />
          <InfoRow
            icon={<Users size={18} aria-hidden="true" />}
            label="Numero famiglie"
            value={String(famiglieCount)}
          />
        </dl>
      </div>

      {(apiario.note?.trim() || apiario.descrizione?.trim()) && (
        <div className="apiario-info__notes meli-glass meli-glass--deep">
          <h2 className="apiario-info__section-title">Note</h2>
          <p>{apiario.note?.trim() || apiario.descrizione}</p>
        </div>
      )}

      {actions && <div className="apiario-info__actions">{actions}</div>}
    </motion.section>
  )
}
