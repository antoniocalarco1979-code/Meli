export {
  resolveApiarioStatus,
  APIARIO_STATUS_LABEL,
  type ApiarioStatus,
} from '../../dashboard/utils/homeHelpers'

export function formatApiarioComune(
  apiario: { comune?: string; localita?: string },
): string {
  return apiario.comune?.trim() || apiario.localita?.trim() || '—'
}
