import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Check, MapPin } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { SuccessToast } from '../../../components/ui/SuccessToast'
import { cameraService, gpsService, type GeoCoordinates } from '../../../services/device'
import { saveNuovaVisita, type VisitaSaveSummary } from '../services/visitaSaveService'
import { emptyNuovaVisitaForm } from '../types'
import {
  emptyVisitaChecklist,
  VISITA_GUIDATA_STEPS,
  type VisitaChecklistState,
  type VisitaGuidataStep,
} from './visitaGuidataSteps'
import './NuovaVisitaModal.css'

type NuovaVisitaModalProps = {
  open: boolean
  arniaId: string
  arniaNumero: string
  apiarioNome?: string
  onClose: () => void
  onSaved?: (summary: VisitaSaveSummary) => void
}

function stepIndex(step: VisitaGuidataStep) {
  return VISITA_GUIDATA_STEPS.findIndex((s) => s.id === step)
}

function isStepDone(step: VisitaGuidataStep, checklist: VisitaChecklistState, photos: string[]) {
  switch (step) {
    case 'posizione':
      return false
    case 'regina':
      return checklist.reginaVerificata !== null
    case 'covata':
      return checklist.covataControllata
    case 'scorte':
      return checklist.scorteControllate
    case 'foto':
      return checklist.telaioFotografato && photos.length > 0
    case 'concluso':
      return false
    default:
      return false
  }
}

export function NuovaVisitaModal({
  open,
  arniaId,
  arniaNumero,
  apiarioNome,
  onClose,
  onSaved,
}: NuovaVisitaModalProps) {
  const [step, setStep] = useState<VisitaGuidataStep>('posizione')
  const [checklist, setChecklist] = useState<VisitaChecklistState>({ ...emptyVisitaChecklist })
  const [photos, setPhotos] = useState<string[]>([])
  const [gps, setGps] = useState<GeoCoordinates | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    void gpsService.getCurrentPosition().then(setGps)
  }, [open])

  const reset = () => {
    setStep('posizione')
    setChecklist({ ...emptyVisitaChecklist })
    setPhotos([])
    setGps(null)
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const goNext = (next: VisitaGuidataStep) => {
    setStep(next)
    setError('')
  }

  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) {
      setPhotos([photo.path])
      setChecklist((p) => ({ ...p, telaioFotografato: true }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const summary = await saveNuovaVisita({
        arniaId,
        photos,
        gps,
        checklist,
        form: {
          ...emptyNuovaVisitaForm,
          reginaVista: checklist.reginaVerificata === true,
          covata: checklist.covataControllata ? 'Covata compatta' : 'Non controllata',
          scorte: checklist.scorteControllate ? 'Scorte abbondanti' : 'Non controllate',
          forza:
            checklist.reginaVerificata && checklist.covataControllata && checklist.scorteControllate
              ? 8
              : 5,
          comportamento: checklist.reginaVerificata !== false ? 'Docile' : undefined,
          note: buildChecklistNote(checklist),
        },
      })
      setToast(true)
      window.setTimeout(() => {
        setToast(false)
        reset()
        onSaved?.({
          fotoCount: summary.fotoCount,
          hadTrattamento: summary.hadTrattamento,
          reginaNonVista: summary.reginaNonVista,
        })
        onClose()
      }, 1200)
    } catch {
      setError('Impossibile salvare la visita. Riprova.')
    } finally {
      setSaving(false)
    }
  }

  const currentIndex = stepIndex(step)

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={`Visita guidata — Arnia ${arniaNumero}`}
        variant="fullscreen"
      >
        <div className="visita-guidata">
          <nav className="visita-guidata__track" aria-label="Passaggi visita">
            {VISITA_GUIDATA_STEPS.map((item, index) => {
              const done = index < currentIndex || (index !== currentIndex && isStepDone(item.id, checklist, photos))
              const current = item.id === step
              return (
                <div key={item.id} className="visita-guidata__track-item">
                  <span
                    className={`visita-guidata__track-dot${
                      done ? ' visita-guidata__track-dot--done' : ''
                    }${current ? ' visita-guidata__track-dot--current' : ''}`}
                  >
                    {done && !current ? <Check size={14} strokeWidth={3} /> : index + 1}
                  </span>
                  {index < VISITA_GUIDATA_STEPS.length - 1 && (
                    <span
                      className={`visita-guidata__track-line${
                        index < currentIndex ? ' visita-guidata__track-line--done' : ''
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </nav>

          <ol className="visita-guidata__list">
            {VISITA_GUIDATA_STEPS.slice(0, currentIndex).map((item) => (
              <li key={item.id} className="visita-guidata__done-row">
                <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                <span>{stepDoneLabel(item.id, checklist)}</span>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="visita-guidata__panel meli-glass meli-glass--deep"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === 'posizione' && (
                <>
                  <p className="visita-guidata__pin" aria-hidden="true">
                    📍
                  </p>
                  <h2 className="visita-guidata__title">
                    Sei davanti all&apos;Arnia {arniaNumero}
                  </h2>
                  {apiarioNome && (
                    <p className="visita-guidata__subtitle">{apiarioNome}</p>
                  )}
                  {gps && (
                    <p className="visita-guidata__gps">
                      <MapPin size={16} aria-hidden="true" />
                      {gps.latitudine}, {gps.longitudine}
                    </p>
                  )}
                  <Button variant="primary" size="lg" fullWidth onClick={() => goNext('regina')}>
                    Inizia ispezione
                  </Button>
                </>
              )}

              {step === 'regina' && (
                <>
                  <p className="visita-guidata__check" aria-hidden="true">
                    ✔
                  </p>
                  <h2 className="visita-guidata__title">Hai verificato la regina?</h2>
                  <div className="visita-guidata__choices">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        setChecklist((p) => ({ ...p, reginaVerificata: true }))
                        goNext('covata')
                      }}
                    >
                      SÌ
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        setChecklist((p) => ({ ...p, reginaVerificata: false }))
                        goNext('covata')
                      }}
                    >
                      NO
                    </Button>
                  </div>
                </>
              )}

              {step === 'covata' && (
                <>
                  <p className="visita-guidata__check" aria-hidden="true">
                    ✔
                  </p>
                  <h2 className="visita-guidata__title">Hai controllato la covata?</h2>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setChecklist((p) => ({ ...p, covataControllata: true }))
                      goNext('scorte')
                    }}
                  >
                    Sì, confermo
                  </Button>
                </>
              )}

              {step === 'scorte' && (
                <>
                  <p className="visita-guidata__check" aria-hidden="true">
                    ✔
                  </p>
                  <h2 className="visita-guidata__title">Hai controllato le scorte?</h2>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setChecklist((p) => ({ ...p, scorteControllate: true }))
                      goNext('foto')
                    }}
                  >
                    Sì, confermo
                  </Button>
                </>
              )}

              {step === 'foto' && (
                <>
                  <p className="visita-guidata__check" aria-hidden="true">
                    ✔
                  </p>
                  <h2 className="visita-guidata__title">Hai fotografato il telaio?</h2>
                  <button
                    type="button"
                    className="visita-guidata__camera meli-glass"
                    onClick={handleCapturePhoto}
                  >
                    <Camera size={36} strokeWidth={1.25} />
                    <span>Scatta foto telaio</span>
                  </button>
                  {photos[0] && (
                    <img src={photos[0]} alt="" className="visita-guidata__preview" />
                  )}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={photos.length === 0}
                    onClick={() => goNext('concluso')}
                  >
                    Continua
                  </Button>
                </>
              )}

              {step === 'concluso' && (
                <>
                  <p className="visita-guidata__check" aria-hidden="true">
                    ✔
                  </p>
                  <h2 className="visita-guidata__title">Hai concluso la visita?</h2>
                  <ul className="visita-guidata__summary">
                    <li>Regina: {checklist.reginaVerificata ? 'Verificata' : 'Non vista'}</li>
                    <li>Covata: controllata</li>
                    <li>Scorte: controllate</li>
                    <li>Foto telaio: {photos.length > 0 ? 'Sì' : 'No'}</li>
                  </ul>
                  {error && <p className="visita-guidata__error">{error}</p>}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={saving}
                    onClick={handleSave}
                  >
                    {saving ? 'Salvataggio…' : 'SALVA VISITA'}
                  </Button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Modal>

      <SuccessToast message="Visita salvata con successo ✔" visible={toast} />
    </>
  )
}

function stepDoneLabel(step: VisitaGuidataStep, checklist: VisitaChecklistState): string {
  switch (step) {
    case 'posizione':
      return 'Posizione confermata'
    case 'regina':
      return checklist.reginaVerificata
        ? 'Hai verificato la regina'
        : 'Regina non verificata'
    case 'covata':
      return 'Hai controllato la covata'
    case 'scorte':
      return 'Hai controllato le scorte'
    case 'foto':
      return 'Hai fotografato il telaio'
    default:
      return ''
  }
}

function buildChecklistNote(checklist: VisitaChecklistState): string {
  const lines = [
    'Checklist visita guidata:',
    `- Regina: ${checklist.reginaVerificata ? 'Sì' : 'No'}`,
    `- Covata: ${checklist.covataControllata ? 'Sì' : 'No'}`,
    `- Scorte: ${checklist.scorteControllate ? 'Sì' : 'No'}`,
    `- Foto telaio: ${checklist.telaioFotografato ? 'Sì' : 'No'}`,
  ]
  return lines.join('\n')
}
