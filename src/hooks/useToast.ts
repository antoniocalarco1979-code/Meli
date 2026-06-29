import { useToastStore, type ToastVariant } from '../stores/toastStore'

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 2200,
  error: 3200,
  info: 2600,
}

export function useToast() {
  const show = useToastStore((state) => state.show)

  return {
    show: (message: string, variant: ToastVariant = 'success', duration?: number) =>
      show(message, variant, duration ?? DEFAULT_DURATION[variant]),
    success: (message: string, duration?: number) =>
      show(message, 'success', duration ?? DEFAULT_DURATION.success),
    error: (message: string, duration?: number) =>
      show(message, 'error', duration ?? DEFAULT_DURATION.error),
    info: (message: string, duration?: number) =>
      show(message, 'info', duration ?? DEFAULT_DURATION.info),
  }
}
