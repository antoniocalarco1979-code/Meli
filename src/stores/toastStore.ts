import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
}

type ToastState = {
  toasts: ToastItem[]
  show: (message: string, variant?: ToastVariant, duration?: number) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, variant = 'success', duration = 2200) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
    window.setTimeout(() => get().dismiss(id), duration)
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))
