import './ApiarioDetailTabs.css'

export type ApiarioDetailTab = 'informazioni' | 'statistiche' | 'giro'

type ApiarioDetailTabsProps = {
  active: ApiarioDetailTab
  onChange: (tab: ApiarioDetailTab) => void
}

const TABS: { id: ApiarioDetailTab; label: string }[] = [
  { id: 'informazioni', label: 'Informazioni' },
  { id: 'statistiche', label: 'Statistiche' },
  { id: 'giro', label: 'Giro apiario' },
]

export function ApiarioDetailTabs({ active, onChange }: ApiarioDetailTabsProps) {
  return (
    <div className="apiario-detail-tabs" role="tablist" aria-label="Sezioni apiario">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`apiario-detail-tabs__btn${active === tab.id ? ' apiario-detail-tabs__btn--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
