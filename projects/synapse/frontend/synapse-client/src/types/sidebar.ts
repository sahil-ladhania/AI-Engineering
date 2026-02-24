export interface SystemPrompt {
  id: string
  title: string
  description: string
}

export interface SidebarProps {
  model: string
  onModelChange: (m: string) => void
  onLogout?: () => void
  open?: boolean
  onClose?: () => void
  onToggle?: () => void
}

export interface ModelSelectorProps {
  value: string
  onChange: (val: string) => void
}

export interface SystemPromptCardProps {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export interface TemperatureSliderProps {
  value: number
  onChange: (val: number) => void
}
