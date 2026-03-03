import { useState } from 'react'
import Logo from './Logo'
import SystemPromptCard from './SystemPromptCard'
import ModelSelector from './ModelSelector'
import TemperatureSlider from './TemperatureSlider'
import type { SidebarProps, SystemPrompt } from '../types/sidebar'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/config'
import { useQuery } from '@tanstack/react-query'
import { getChatsService } from '../services/chatServices'

const CHAT_HISTORY = [
  { id: 1, title: 'How to use useEffect with async', time: '2h ago',    active: true  },
  { id: 2, title: 'Build a REST API in Node.js',    time: 'Yesterday',  active: false },
  { id: 3, title: 'CSS Grid vs Flexbox explained',  time: '2 days ago', active: false },
  { id: 4, title: 'Python list comprehensions',     time: '3 days ago', active: false },
]

const SYSTEM_PROMPTS: SystemPrompt[] = [
  { id: 'default',               title: '🧠 Default Assistant',     description: 'Balanced, helpful responses for any task',                          temperature: 0.7 },
  { id: 'code-expert',           title: '💻 Code Expert',           description: 'Deep technical knowledge, prefers code over prose',                 temperature: 0.2 },
  { id: 'content-writer',        title: '✍️ Content Writer',        description: 'Clear, engaging writing and editing assistance',                    temperature: 0.7 },
  { id: 'data-analyst',          title: '📊 Data Analyst',          description: 'Data interpretation, stats, and visual insights',                   temperature: 0.5 },
  { id: 'socratic-tutor',        title: '🎓 Socratic Tutor',        description: 'Guides you to answers through questions, never tells you directly', temperature: 0.3 },
  { id: 'devils-advocate',       title: '😈 Devil\'s Advocate',     description: 'Argues the opposite of whatever you say',                           temperature: 0.9 },
  { id: 'security-reviewer',     title: '🔒 Security Reviewer',     description: 'Reviews code and architecture for vulnerabilities',                 temperature: 0.1 },
  { id: 'creative-brainstormer', title: '💡 Creative Brainstormer', description: 'Uninhibited ideation — wild, unconventional, energetic',            temperature: 1.2 },
  { id: 'rubber-duck-debugger',  title: '🦆 Rubber Duck Debugger',  description: 'Helps you find bugs by asking questions, never tells you the answer', temperature: 0.4 },
]

export default function Sidebar({ model, onModelChange, onLogout = () => {}, open = true, onClose = () => {}, onToggle = () => {}, handleCreateNewChat = () => {} }: SidebarProps) {
  // State Variables
  const [selectedPrompt, setSelectedPrompt] = useState('default');
  const [temperature, setTemperature] = useState(0.7);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // useSelector
  const user = useSelector((state: RootState) => state.auth.user);

  // useQuery
  const { data: chatHistory } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatsService
  });

  return (
    <div
      className="relative shrink-0 h-full"
      style={{
        width: open ? '260px' : '0px',
        transition: 'width 0.25s ease',
      }}
    >
      {/* Sidebar panel */}
      <aside
        className="absolute inset-y-0 left-0 flex flex-col z-40"
        style={{
          width: '260px',
          background: '#0c1115',
          borderRight: '1px solid #161f26',
          transform: open ? 'translateX(0)' : 'translateX(-260px)',
          transition: 'transform 0.25s ease',
          overflow: 'hidden',
        }}
      >

        {/* ── Header ─────────────────────────────────── */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between shrink-0">
          <Logo size="md" />
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-[#475569] hover:text-[#e2ede9] transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* ── New Chat button ─────────────────────────── */}
        <div className="px-4 pb-3 shrink-0">
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[13px] font-medium text-[#0c1115] bg-[#10b981] hover:bg-[#0ea572] active:scale-[0.98] transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="h-px bg-[#161f26] mx-4 shrink-0" />

        {/* ── Scrollable content ──────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">

          {/* Recent Chats */}
          <section className="flex flex-col gap-1">
            <h3 className="text-[#334e5a] text-[10px] uppercase tracking-widest font-semibold px-1 pb-1">
              Recent Chats
            </h3>
            <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto">
              {(chatHistory?.length > 0) ? (
                chatHistory?.map((chat: any) => (
                  <button
                    type="button"
                    key={chat.id}
                    onClick={() => {}}
                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-[#ffffff07]"
                    style={
                      chat.active
                        ? { borderLeft: '2px solid #10b981', paddingLeft: '10px', background: '#10b98108' }
                        : {}
                    }
                  >
                    <span className="truncate text-[12.5px] text-[#8099a8] leading-snug">{chat.title}</span>
                  </button>
                ))
              ) : (
                <p className="text-[11.5px] text-[#283d49] px-1 py-1">No chats yet</p>
              )}
            </div>
          </section>

          <div className="h-px bg-[#161f26]" />

          {/* Persona */}
          <section className="flex flex-col gap-1">
            <h3 className="text-[#334e5a] text-[10px] uppercase tracking-widest font-semibold px-1 pb-1">
              Persona
            </h3>
            <div className="flex flex-col gap-0.5">
              {SYSTEM_PROMPTS.map((p) => (
                <SystemPromptCard
                  key={p.id}
                  title={p.title}
                  description={p.description}
                  selected={selectedPrompt === p.id}
                  onClick={() => {
                    setSelectedPrompt(p.id);
                    setTemperature(p.temperature);
                  }}
                />
              ))}
            </div>
          </section>

          <div className="h-px bg-[#161f26]" />

          {/* Settings — collapsible */}
          <section className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setSettingsOpen((o) => !o)}
              className="flex items-center justify-between px-1 pb-1 w-full"
            >
              <h3 className="text-[#334e5a] text-[10px] uppercase tracking-widest font-semibold">
                Settings
              </h3>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#334e5a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {settingsOpen && (
              <div className="flex flex-col gap-3 pt-1">
                <ModelSelector value={model} onChange={onModelChange} />
                <TemperatureSlider value={temperature} onChange={setTemperature} />
              </div>
            )}
          </section>

        </div>

        {/* ── Footer — user profile ───────────────────── */}
        <div
          className="shrink-0 flex items-center gap-2.5 px-3 py-3"
          style={{ borderTop: '1px solid #161f26' }}
        >
          {/* Avatar */}
          <div
            className="shrink-0 flex items-center justify-center rounded-full text-[#0c1115] text-[12px] font-semibold"
            style={{
              width: '30px',
              height: '30px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
            }}
          >
            {user?.name?.charAt(0) ?? '?'}
          </div>

          {/* Name + email + cost */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="truncate text-[12.5px] text-[#8099a8] leading-tight">{user?.name}</span>
            <span className="truncate text-[10.5px] text-[#334e5a] leading-tight">{user?.email}</span>
          </div>

          {/* Session cost badge */}
          <span className="shrink-0 text-[10px] text-[#334e5a] bg-[#161f26] px-1.5 py-0.5 rounded-md">
            $0.00
          </span>

          {/* Sign out */}
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 text-[#334e5a] hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

      </aside>

      {/* Toggle button — desktop only */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center hover:bg-[#161f26] transition-colors"
        style={{
          right: '-18px',
          width: '18px',
          height: '44px',
          background: '#0c1115',
          border: '1px solid #161f26',
          borderLeft: 'none',
          borderRadius: '0 6px 6px 0',
          cursor: 'pointer',
          color: '#334e5a',
          fontSize: '12px',
        }}
      >
        {open ? '‹' : '›'}
      </button>
    </div>
  )
}
