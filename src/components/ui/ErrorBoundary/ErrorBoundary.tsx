import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorPage } from '../../common/ErrorPage'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[MELI] ErrorBoundary:', error, info.componentStack)
  }

  handleRetry = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback

      return (
        <ErrorPage
          fullScreen
          title="Errore applicazione"
          message={this.state.error.message || 'Si è verificato un errore imprevisto.'}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
