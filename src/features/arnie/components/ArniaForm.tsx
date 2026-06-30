import type { ArniaInput } from '../../../database/types/inputs'
import type { Arnia } from '../../../database/types'
import { ArniaWizard } from './arnia-wizard/ArniaWizard'

type ArniaFormProps = {
  apiarioId: string
  apiarioNome?: string
  onSubmit: (data: ArniaInput) => Promise<Arnia>
  onComplete?: (arnia: Arnia) => void
  onCancel?: () => void
  submitLabel?: string
}

/** Flusso guidato di creazione arnia — 5 step. */
export function ArniaForm(props: ArniaFormProps) {
  return <ArniaWizard {...props} submitLabel={props.submitLabel ?? 'SALVA'} />
}
