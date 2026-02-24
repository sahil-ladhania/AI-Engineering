import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  variant: 'success' | 'error' | 'info' | 'warning'
  name: string
  description?: string
}

const variantIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
}

const variantColors = {
  success: '#10b981',
  error: '#ef4444',
  info: '#06b6d4',
  warning: '#f59e0b'
}

export const toast = ({ variant, name, description }: ToastOptions) => {
  sonnerToast(name, {
    description,
    icon: variantIcons[variant],
    style: {
      borderLeft: `3px solid ${variantColors[variant]}`
    }
  })
}
