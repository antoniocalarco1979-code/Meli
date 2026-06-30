import type { ReactNode } from 'react'
import { parseDexieError } from '../../database/errors'
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
    console.warn('[MELI] Query error (mostrato stato vuoto):', parseDexieError(error))
  }

  return children
}
