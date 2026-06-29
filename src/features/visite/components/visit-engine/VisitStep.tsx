import type { ReactNode } from 'react'

type VisitStepProps = {
  emoji: string
  question: string
  hint?: string
  children: ReactNode
}

export function VisitStep({ emoji, question, hint, children }: VisitStepProps) {
  return (
    <section className="visit-step">
      <p className="visit-step__emoji" aria-hidden="true">
        {emoji}
      </p>
      <h2 className="visit-step__question">{question}</h2>
      {hint && <p className="visit-step__hint">{hint}</p>}
      {children}
    </section>
  )
}
