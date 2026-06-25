import { EmptyState } from '../ui/EmptyState'
import { PageTitle } from '../ui/PageTitle'
import './FeaturePage.css'

type FeaturePageProps = {
  title: string
  description?: string
}

export function FeaturePage({ title, description }: FeaturePageProps) {
  return (
    <div className="feature-page">
      <PageTitle title={title} subtitle={description} />
      <EmptyState
        title="Sezione in sviluppo"
        description={`La gestione ${title.toLowerCase()} sarà disponibile prossimamente.`}
      />
    </div>
  )
}
