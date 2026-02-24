import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import type { Modal, View } from './types/app'

export default function App() {
  const [view, setView] = useState<View>('landing')
  // const [view, setView] = useState<View>('chat')
  const [modal, setModal] = useState<Modal>('none')
  const [model, setModel] = useState('gpt-4o-mini')

  if (view === 'chat') {
    return (
      <ChatPage
        model={model}
        onModelChange={setModel}
        onLogout={() => setView('landing')}
      />
    )
  }

  return (
    <LandingPage
      showLogin={modal === 'login'}
      showSignup={modal === 'signup'}
      onOpenLogin={() => setModal('login')}
      onOpenSignup={() => setModal('signup')}
      onCloseModal={() => setModal('none')}
      onSwitchToLogin={() => setModal('login')}
      onSwitchToSignup={() => setModal('signup')}
    />
  )
}
