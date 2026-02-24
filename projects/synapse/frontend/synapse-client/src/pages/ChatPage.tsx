import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import type { ChatPageProps } from '../types/pages'

export default function ChatPage({
  model,
  onModelChange = () => {},
  onLogout = () => {},
}: ChatPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        onModelChange={onModelChange}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatArea
        model={model}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
    </div>
  )
}
