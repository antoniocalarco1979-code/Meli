import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { LoadingScreen } from '../../components/ui/LoadingScreen'
import { createArnia } from '../../database/services/arnieService'
import type { ArniaInput } from '../../database/types/inputs'
import { db } from '../../database'
import { useLiveQuery } from '../../hooks/useLiveQuery'
import { storageService } from '../../services/device/storageService'
import { ApiarioForm } from '../apiari/components/ApiarioForm'
import { ArniaForm } from '../arnie/components/ArniaForm'
import { createApiario } from '../apiari/services/apiariService'
import type { ApiarioInput } from '../apiari/types'
import './OnboardingPage.css'

const SELECTED_APIARIO_KEY = 'selected-apiario-id'

type OnboardingStep = 'welcome' | 'add-arnia' | 'done'

const STEPS: { id: OnboardingStep | 'apiario'; label: string }[] = [
  { id: 'welcome', label: 'Benvenuto' },
  { id: 'apiario', label: 'Crea Apiario' },
  { id: 'add-arnia', label: 'Aggiungi Arnia' },
  { id: 'done', label: 'Fine' },
]

function stepIndex(step: OnboardingStep, apiarioDialogOpen: boolean): number {
  if (step === 'welcome') return apiarioDialogOpen ? 1 : 0
  if (step === 'add-arnia') return 2
  return 3
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { data: counts, loading } = useLiveQuery(
    async () => ({
      apiari: await db.apiari.count(),
      arnie: await db.arnie.count(),
    }),
    [],
  )
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [apiarioId, setApiarioId] = useState<string>()
  const [apiarioDialogOpen, setApiarioDialogOpen] = useState(false)
  const [arniaDialogOpen, setArnialogOpen] = useState(false)

  useEffect(() => {
    if (loading || !counts) return

    if (counts.apiari > 0 && counts.arnie > 0) {
      navigate('/apiari', { replace: true })
      return
    }

    if (counts.apiari > 0 && counts.arnie === 0 && step === 'welcome') {
      void db.apiari.toCollection().first().then((apiario) => {
        if (apiario) {
          setApiarioId(apiario.id)
          setStep('add-arnia')
        }
      })
    }
  }, [counts, loading, navigate, step])

  useEffect(() => {
    if (step === 'add-arnia' && apiarioId) {
      setArnialogOpen(true)
    }
  }, [step, apiarioId])

  if (loading) {
    return <LoadingScreen label="Caricamento…" />
  }

  const activeIndex = stepIndex(step, apiarioDialogOpen)

  const handleApiarioSubmit = async (data: ApiarioInput) => {
    const created = await createApiario(data)
    setApiarioId(created.id)
    await storageService.set(SELECTED_APIARIO_KEY, created.id)
    setApiarioDialogOpen(false)
    setStep('add-arnia')
  }

  const handleArniaSubmit = async (data: ArniaInput) => {
    await createArnia(data)
    setArnialogOpen(false)
    setStep('done')
  }

  const finish = () => {
    navigate('/apiari', { replace: true })
  }

  return (
    <div className="onboarding">
      <header className="onboarding__brand">
        <p className="onboarding__logo">
          <span aria-hidden="true">🐝</span> MELI
        </p>
        <p className="onboarding__byline">by RANU</p>
      </header>

      {!(step === 'welcome' && !apiarioDialogOpen) && (
        <nav className="onboarding__flow" aria-label="Passaggi configurazione">
          {STEPS.map((item, index) => (
            <div key={item.label} className="onboarding-flow__item">
              <span
                className={`onboarding-flow__label${index <= activeIndex ? ' onboarding-flow__label--active' : ''}${index === activeIndex ? ' onboarding-flow__label--current' : ''}`}
              >
                {item.label}
              </span>
              {index < STEPS.length - 1 && (
                <span className="onboarding-flow__arrow" aria-hidden="true">
                  ↓
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      <main className="onboarding__main">
        {step === 'welcome' && (
          <section className="onboarding-step onboarding-step--welcome">
            <h1 className="onboarding-step__title">Benvenuto</h1>
            <Button
              variant="primary"
              size="lg"
              className="onboarding-step__cta"
              onClick={() => setApiarioDialogOpen(true)}
            >
              Crea il primo Apiario
            </Button>
          </section>
        )}

        {step === 'add-arnia' && (
          <section className="onboarding-step">
            <h2 className="onboarding-step__title">Aggiungi Arnia</h2>
            <p className="onboarding-step__lead">Registra la prima arnia del tuo apiario.</p>
            <Button
              variant="primary"
              size="lg"
              className="onboarding-step__cta"
              onClick={() => setArnialogOpen(true)}
            >
              Aggiungi arnia
            </Button>
          </section>
        )}

        {step === 'done' && (
          <section className="onboarding-step">
            <p className="onboarding-step__success" aria-hidden="true">
              ✓
            </p>
            <h2 className="onboarding-step__title">Fine</h2>
            <p className="onboarding-step__lead">Il tuo apiario è pronto. Buon lavoro sul campo.</p>
            <Button variant="primary" size="lg" className="onboarding-step__cta" onClick={finish}>
              Inizia con MELI
            </Button>
          </section>
        )}
      </main>

      <Modal open={apiarioDialogOpen} onClose={() => setApiarioDialogOpen(false)} title="Crea Apiario">
        <ApiarioForm
          key={apiarioDialogOpen ? 'apiario-open' : 'apiario-closed'}
          onboarding
          submitLabel="Salva"
          onCancel={() => setApiarioDialogOpen(false)}
          onSubmit={handleApiarioSubmit}
        />
      </Modal>

      {apiarioId && (
        <Modal open={arniaDialogOpen} onClose={() => setArnialogOpen(false)} title="Aggiungi Arnia">
          <ArniaForm
            key={arniaDialogOpen ? 'arnia-open' : 'arnia-closed'}
            apiarioId={apiarioId}
            submitLabel="Salva"
            onCancel={() => setArnialogOpen(false)}
            onSubmit={handleArniaSubmit}
          />
        </Modal>
      )}
    </div>
  )
}
