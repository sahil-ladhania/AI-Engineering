export interface LoginModalProps {
  open?: boolean
  onClose?: () => void
  onSwitchToSignup?: () => void
}

export interface SignupModalProps {
  open?: boolean
  onClose?: () => void
  onSwitchToLogin?: () => void
}
