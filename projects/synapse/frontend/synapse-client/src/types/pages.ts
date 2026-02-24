export interface LandingPageProps {
  showLogin?: boolean
  showSignup?: boolean
  onOpenLogin?: () => void
  onOpenSignup?: () => void
  onCloseModal?: () => void
  onSwitchToLogin?: () => void
  onSwitchToSignup?: () => void
}

export interface ChatPageProps {
  model: string
  onModelChange?: (m: string) => void
  onLogout?: () => void
}
