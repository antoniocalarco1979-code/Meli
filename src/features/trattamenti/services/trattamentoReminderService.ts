import type { Trattamento, TrattamentoCalendarioPromemoria } from '../../../database/types'
import { formatTrattamentoTipoLabel } from '../utils/trattamentoFormatters'

type IdGenerator = () => string

const DEFAULT_FOLLOW_UP_DAYS = 21

function inferTipoPromemoria(tipo?: string): TrattamentoCalendarioPromemoria['tipoPromemoria'] {
  if (tipo === 'varroa') return 'rimozione'
  if (tipo === 'nutrizione') return 'follow_up'
  return 'controllo'
}

/** Costruisce il promemoria calendario da un trattamento (Sprint 3 — solo architettura). */
export function buildTrattamentoCalendarioPromemoria(
  trattamento: Trattamento,
  generateId: IdGenerator,
): TrattamentoCalendarioPromemoria | undefined {
  const dataPromemoria =
    trattamento.scadenza ??
    trattamento.data + DEFAULT_FOLLOW_UP_DAYS * 86_400_000

  if (!dataPromemoria) return undefined

  const tipoLabel = formatTrattamentoTipoLabel(trattamento.tipo)
  const principio = trattamento.principioAttivo ?? trattamento.prodotto
  const titoloParts = ['Trattamento', tipoLabel !== '—' ? tipoLabel : null, principio].filter(Boolean)

  return {
    id: generateId(),
    trattamentoId: trattamento.id,
    arniaId: trattamento.arniaId,
    titolo: titoloParts.join(' · '),
    dataPromemoria,
    tipoPromemoria: inferTipoPromemoria(trattamento.tipo),
    notificationChannel: 'calendar',
    stato: 'programmato',
    createdAt: Date.now(),
  }
}

/** Contratto futuro per notifiche push — non implementato in Sprint 3. */
export type TrattamentoNotificationRequest = {
  promemoria: TrattamentoCalendarioPromemoria
  arniaNumero?: string
  apiarioNome?: string
}

export function buildTrattamentoNotificationRequest(
  promemoria: TrattamentoCalendarioPromemoria,
  context?: { arniaNumero?: string; apiarioNome?: string },
): TrattamentoNotificationRequest {
  return {
    promemoria,
    arniaNumero: context?.arniaNumero,
    apiarioNome: context?.apiarioNome,
  }
}
