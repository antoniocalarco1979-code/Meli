import { Loader2 } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import {
  searchNominatimPlaces,
  type NominatimPlaceSuggestion,
  type NominatimSearchScope,
} from '../../services/geocoding'
import './NominatimAutocomplete.css'

type NominatimAutocompleteProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  onSelect: (suggestion: NominatimPlaceSuggestion) => void
  scope: NominatimSearchScope
  context?: { comune?: string; provincia?: string }
  placeholder?: string
  disabled?: boolean
  hint?: string
}

function shortLabel(suggestion: NominatimPlaceSuggestion, scope: NominatimSearchScope): string {
  if (scope === 'street') {
    return suggestion.indirizzo ?? suggestion.label.split(',')[0]?.trim() ?? suggestion.label
  }
  if (scope === 'city') {
    return suggestion.comune ?? suggestion.label.split(',')[0]?.trim() ?? suggestion.label
  }
  return suggestion.provincia ?? suggestion.label.split(',')[0]?.trim() ?? suggestion.label
}

export function NominatimAutocomplete({
  label,
  value,
  onValueChange,
  onSelect,
  scope,
  context,
  placeholder,
  disabled = false,
  hint,
}: NominatimAutocompleteProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<NominatimPlaceSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (disabled || value.trim().length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    let cancelled = false
    const handle = window.setTimeout(async () => {
      setLoading(true)
      const results = await searchNominatimPlaces(value, scope, context)
      if (cancelled) return
      setSuggestions(results)
      setLoading(false)
      setOpen(results.length > 0)
      setActiveIndex(-1)
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [value, scope, context?.comune, context?.provincia, disabled])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pickSuggestion = (suggestion: NominatimPlaceSuggestion) => {
    onValueChange(shortLabel(suggestion, scope))
    onSelect(suggestion)
    setOpen(false)
    setSuggestions([])
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      pickSuggestion(suggestions[activeIndex]!)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const inputId = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="nominatim-autocomplete" ref={rootRef}>
      <label className="nominatim-autocomplete__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="nominatim-autocomplete__field-wrap">
        <input
          id={inputId}
          className="nominatim-autocomplete__field meli-glass"
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {loading && (
          <Loader2 size={16} className="nominatim-autocomplete__spinner" aria-hidden="true" />
        )}
      </div>
      {hint && <span className="nominatim-autocomplete__hint">{hint}</span>}

      {open && suggestions.length > 0 && (
        <ul id={listId} className="nominatim-autocomplete__list" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`nominatim-autocomplete__option${
                  index === activeIndex ? ' nominatim-autocomplete__option--active' : ''
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pickSuggestion(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
