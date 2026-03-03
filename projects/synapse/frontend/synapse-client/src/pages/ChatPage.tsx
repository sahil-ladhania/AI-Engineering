import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { logoutService } from '../services/authServices'
import { toast } from '../utils/toast'

export default function ChatPage() {
  const dispatch = useAppDispatch()
  const [model, setModel] = useState('gpt-4o-mini')
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)

  const handleLogout = async () => {
    try {
      await logoutService()
      dispatch(logout())
      toast({ variant: 'success', name: 'Logged Out', description: 'You have been signed out successfully.' })
    } catch {
      toast({ variant: 'error', name: 'Logout Failed', description: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#090d0f', color: '#e2ede9' }}
    >
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        model={model}
        onModelChange={setModel}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <ChatArea
        model={model}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
    </div>
  )
}
