import type { CSSProperties } from 'react'
import './Skeleton.css'

type SkeletonProps = {
  className?: string
  variant?: 'text' | 'title' | 'card' | 'hero' | 'block'
  style?: CSSProperties
}

export function Skeleton({ className = '', variant = 'block', style }: SkeletonProps) {
  const variantClass =
    variant === 'block' ? '' : ` ui-skeleton--${variant}`

  return (
    <div
      className={`ui-skeleton${variantClass}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={style}
    />
  )
}

type PageSkeletonProps = {
  variant?: 'list' | 'detail' | 'default'
}

export function PageSkeleton({ variant = 'default' }: PageSkeletonProps) {
  if (variant === 'list') {
    return (
      <div className="ui-skeleton-page" aria-busy="true" aria-label="Caricamento contenuto">
        <div className="ui-skeleton-page__header">
          <Skeleton variant="title" />
          <Skeleton variant="text" style={{ width: '40%' }} />
        </div>
        <div className="ui-skeleton-grid ui-skeleton-grid--cards">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    )
  }

  if (variant === 'detail') {
    return (
      <div className="ui-skeleton-page" aria-busy="true" aria-label="Caricamento contenuto">
        <Skeleton variant="hero" />
        <Skeleton variant="title" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    )
  }

  return (
    <div className="ui-skeleton-page" aria-busy="true" aria-label="Caricamento contenuto">
      <Skeleton variant="title" />
      <Skeleton variant="text" style={{ width: '70%' }} />
      <Skeleton variant="card" />
    </div>
  )
}
