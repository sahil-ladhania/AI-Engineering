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
  onToggleSidebar?: () => void
}

export interface InputBarProps {
  streaming?: boolean
}
