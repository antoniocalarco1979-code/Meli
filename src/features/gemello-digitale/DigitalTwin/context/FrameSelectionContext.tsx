import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type FrameSelectionContextValue = {
  selectedFrameId: string | null
  hoveredFrameId: string | null
  selectFrame: (id: string | null) => void
  hoverFrame: (id: string | null) => void
}

const FrameSelectionContext = createContext<FrameSelectionContextValue | null>(null)

type FrameSelectionProviderProps = {
  children: ReactNode
  selectedFrameId?: string | null
  onFrameSelect?: (frameId: string | null) => void
}

export function FrameSelectionProvider({
  children,
  selectedFrameId: controlledSelectedFrameId,
  onFrameSelect,
}: FrameSelectionProviderProps) {
  const [internalSelectedFrameId, setInternalSelectedFrameId] = useState<string | null>(null)
  const [hoveredFrameId, setHoveredFrameId] = useState<string | null>(null)

  const isControlled = controlledSelectedFrameId !== undefined || Boolean(onFrameSelect)
  const selectedFrameId = isControlled ? (controlledSelectedFrameId ?? null) : internalSelectedFrameId

  useEffect(() => {
    if (controlledSelectedFrameId !== undefined) {
      setInternalSelectedFrameId(controlledSelectedFrameId)
    }
  }, [controlledSelectedFrameId])

  const selectFrame = useCallback(
    (id: string | null) => {
      if (!isControlled) {
        setInternalSelectedFrameId(id)
      }
      onFrameSelect?.(id)
    },
    [isControlled, onFrameSelect],
  )

  const value = useMemo<FrameSelectionContextValue>(
    () => ({
      selectedFrameId,
      hoveredFrameId,
      selectFrame,
      hoverFrame: setHoveredFrameId,
    }),
    [hoveredFrameId, selectFrame, selectedFrameId],
  )

  return (
    <FrameSelectionContext.Provider value={value}>{children}</FrameSelectionContext.Provider>
  )
}

export function useFrameSelectionOptional() {
  return useContext(FrameSelectionContext)
}

export function useFrameSelection() {
  const ctx = useContext(FrameSelectionContext)
  if (!ctx) throw new Error('useFrameSelection requires FrameSelectionProvider')
  return ctx
}
