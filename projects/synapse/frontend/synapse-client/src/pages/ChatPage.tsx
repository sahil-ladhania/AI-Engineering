import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { logoutService } from '../services/authServices'
import { toast } from '../utils/toast'
import { useNavigate, useParams } from 'react-router-dom'

export default function ChatPage() {
  // useNavigate  
  const navigate = useNavigate();

  // useParams
  const { chatId } = useParams<{ chatId: string }>();

  // useDispatch
  const dispatch = useAppDispatch()

  // State Variables
  const [model, setModel] = useState('gpt-4o-mini');
  const [personaId, setPersonaId] = useState('default');
  const [temperature, setTemperature] = useState(0.7);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  // Handler Functions
  const handleLogout = async () => {
    try {
      await logoutService()
      dispatch(logout())
      toast({ 
        variant: 'success', 
        name: 'Logged Out', 
        description: 'You have been signed out successfully.' 
      })
    } 
    catch {
      toast({ 
        variant: 'error', 
        name: 'Logout Failed', 
        description: 'Something went wrong. Please try again.' 
      })
    }
  }

  const handleCreateNewChat = () => {
    navigate('/chat');
  };

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
        personaId={personaId}
        onPersonaChange={setPersonaId}
        temperature={temperature}
        onTemperatureChange={setTemperature}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((o) => !o)}
        handleCreateNewChat={handleCreateNewChat}
      />

      <ChatArea
        model={model}
        chatId={chatId}
        personaId={personaId}
        temperature={temperature}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
    </div>
  )
};