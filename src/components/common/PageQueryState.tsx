import type { ReactNode } from 'react'
import { parseDexieError } from '../../database/errors'
import { ErrorPage } from './ErrorPage'
import { PageSkeleton } from '../ui/Skeleton'

type PageQueryStateProps = {
  loading: boolean
  error?: Error | null
  skeleton?: 'list' | 'detail' | 'default'
  children: ReactNode
}

export function PageQueryState({
  loading,
  error,
  skeleton = 'default',
  children,
}: PageQueryStateProps) {
  if (loading) {
    return <PageSkeleton variant={skeleton} />
  }

  if (error) {
    return (
      <ErrorPage
        title="Errore di caricamento"
        message={parseDexieError(error)}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return children
}
