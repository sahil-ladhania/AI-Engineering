import { useState } from 'react'
import Logo from './Logo'
import SystemPromptCard from './SystemPromptCard'
import ModelSelector from './ModelSelector'
import TemperatureSlider from './TemperatureSlider'
import type { SidebarProps, SystemPrompt } from '../types/sidebar'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/config'

const CHAT_HISTORY = [
  { id: 1, title: 'How to use useEffect with async', time: '2h ago',    active: true  },
  { id: 2, title: 'Build a REST API in Node.js',    time: 'Yesterday',  active: false },
  { id: 3, title: 'CSS Grid vs Flexbox explained',  time: '2 days ago', active: false },
  { id: 4, title: 'Python list comprehensions',     time: '3 days ago', active: false },
]

const SYSTEM_PROMPTS: SystemPrompt[] = [
  { id: 'default', title: '🧠 Default Assistant', description: 'Balanced, helpful responses for any task' },
  { id: 'code', title: '💻 Code Expert', description: 'Deep technical knowledge, prefers code over prose' },
  { id: 'writer', title: '✍️ Content Writer', description: 'Clear, engaging writing and editing assistance' },
  { id: 'analyst', title: '📊 Data Analyst', description: 'Data interpretation, stats, and visual insights' },
]

export default function Sidebar({ model, onModelChange, onLogout = () => {}, open = true, onClose = () => {}, onToggle = () => {}, }: SidebarProps) {
  // State Variables
  const [selectedPrompt, setSelectedPrompt] = useState('default');
  const [temperature, setTemperature] = useState(0.7);

  // useSelector
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div
      className="relative flex-shrink-0 h-full"
      style={{
        width: open ? '260px' : '0px',
        transition: 'width 0.25s ease',
      }}
    >
      {/* Sidebar panel — slides in/out via transform */}
      <aside
        className="absolute inset-y-0 left-0 flex flex-col z-40"
        style={{
          width: '260px',
          background: '#0f1519',
          borderRight: '1px solid #1a2228',
          transform: open ? 'translateX(0)' : 'translateX(-260px)',
          transition: 'transform 0.25s ease',
          overflow: 'hidden',
        }}
      >

      {/* Logo + mobile close button */}
      <div className="px-5 py-5 border-b border-[#1a2228] flex items-center justify-between">
        <Logo size="md" />
        <button
          onClick={onClose}
          className="md:hidden text-[#475569] hover:text-[#e2ede9] transition-colors text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">

        {/* Chat History section */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[#475569] text-[11px] uppercase tracking-wider font-medium px-1">
            Recent Chats
          </h3>
          <div className="flex flex-col gap-0.5 max-h-[180px] overflow-y-auto">
            {CHAT_HISTORY.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {}}
                className="w-full text-left flex flex-col gap-0.5 px-3 py-2 rounded-lg transition-colors hover:bg-[#1e1e2e]"
                style={
                  chat.active
                    ? { background: '#1e1e2e', borderLeft: '2px solid #10b981', paddingLeft: '10px' }
                    : {}
                }
              >
                <span
                  className="truncate leading-tight"
                  style={{ fontSize: '13px', color: '#e2e8f0' }}
                >
                  {chat.title}
                </span>
                <span style={{ fontSize: '11px', color: '#475569' }}>
                  {chat.time}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* System Prompt section */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[#475569] text-[11px] uppercase tracking-wider font-medium px-1">
            System Prompt
          </h3>
          <div className="flex flex-col gap-1.5">
            {SYSTEM_PROMPTS.map((p) => (
              <SystemPromptCard
                key={p.id}
                title={p.title}
                description={p.description}
                selected={selectedPrompt === p.id}
                onClick={() => setSelectedPrompt(p.id)}
              />
            ))}
          </div>
        </section>

        {/* Settings section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-[#475569] text-[11px] uppercase tracking-wider font-medium px-1">
            Settings
          </h3>
          <ModelSelector value={model} onChange={onModelChange} />
          <TemperatureSlider value={temperature} onChange={setTemperature} />
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1a2228] flex flex-col">
        {/* New Chat + Session Cost */}
        <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
          <button
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-[#10b981] transition-all hover:shadow-[0_0_12px_#10b98144] active:scale-[0.98]"
          >
            New Chat
          </button>
          <p className="text-center text-[#475569] text-[11px]">
            Session Cost: $0.0024
          </p>
        </div>

        {/* User Profile */}
        <div
          className="flex items-center px-3 py-3"
          style={{ borderTop: '1px solid #1e1e2e', gap: '10px' }}
        >
          {/* Avatar */}
          <div
            className="shrink-0 flex items-center justify-center rounded-full text-white"
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {user?.name?.charAt(0) ?? '?'}
          </div>

          {/* User info */}
          <div className="flex flex-col min-w-0">
            <span
              className="truncate"
              style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 400 }}
            >
              {user?.name}
            </span>
            <span
              className="truncate"
              style={{ fontSize: '11px', color: '#475569' }}
            >
              {user?.email}
            </span>
          </div>

          {/* Sign out icon */}
          <button
            onClick={onLogout}
            className="ml-auto shrink-0 transition-colors"
            style={{ color: '#475569', cursor: 'pointer' }}
            title="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-red-400 transition-colors">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
      </aside>

      {/* Toggle button — desktop only, sticks out right edge */}
      <button
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center transition-colors hover:bg-[#1e1e2e]"
        style={{
          right: '-20px',
          width: '20px',
          height: '48px',
          background: '#111118',
          border: '1px solid #1e1e2e',
          borderLeft: 'none',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          color: '#475569',
          fontSize: '14px',
        }}
      >
        {open ? '‹' : '›'}
      </button>
    </div>
  )
}
