import type { TextareaHTMLAttributes } from 'react'
import './Textarea.css'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  hint?: string
}

export function Textarea({ label, hint, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`ui-textarea ${className}`.trim()}>
      {label && (
        <label className="ui-textarea__label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea id={textareaId} className="ui-textarea__field meli-glass" {...props} />
      {hint && <span className="ui-textarea__hint">{hint}</span>}
    </div>
  )
}
