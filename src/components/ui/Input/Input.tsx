import type { InputHTMLAttributes } from 'react'
import './Input.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`ui-input${error ? ' ui-input--error' : ''} ${className}`.trim()}>
      {label && (
        <label className="ui-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className="ui-input__field meli-glass" {...props} />
      {error && <span className="ui-input__error">{error}</span>}
      {!error && hint && <span className="ui-input__hint">{hint}</span>}
    </div>
  )
}
