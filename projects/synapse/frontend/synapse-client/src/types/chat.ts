export interface Message {
  id: number
  role: 'user' | 'ai'
  content: string
  tokens: number
  cost: string
}

export interface MessageBubbleProps {
  role: 'user' | 'ai'
  content: string
  tokens: number
  cost: string
  streaming?: boolean
}

export interface ChatAreaProps {
  model: string
  chatId?: string
  personaId: string
  temperature: number
  onToggleSidebar?: () => void
}

export interface InputBarProps {
  streaming?: boolean
  onSubmit: (text: string) => void
}