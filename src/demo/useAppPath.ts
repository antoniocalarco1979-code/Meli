import { useLocation } from 'react-router-dom'

export function useDemoMode() {
  const { pathname } = useLocation()
  const isDemoMode = pathname === '/demo' || pathname.startsWith('/demo/')

  return {
    isDemoMode,
    pathPrefix: isDemoMode ? '/demo' : '',
  }
}

/** Costruisce path rispettando il prefisso demo (`/demo/...`). */
export function useAppPath() {
  const { pathPrefix } = useDemoMode()

  return (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`
    return `${pathPrefix}${normalized}`
  }
}
