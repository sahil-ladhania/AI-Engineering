import { useState } from 'react'
import Logo from './Logo'
import SystemPromptCard from './SystemPromptCard'
import ModelSelector from './ModelSelector'
import TemperatureSlider from './TemperatureSlider'
import type { SidebarProps, SystemPrompt } from '../types/sidebar'

const SYSTEM_PROMPTS: SystemPrompt[] = [
  { id: 'default', title: '🧠 Default Assistant', description: 'Balanced, helpful responses for any task' },
  { id: 'code', title: '💻 Code Expert', description: 'Deep technical knowledge, prefers code over prose' },
  { id: 'writer', title: '✍️ Content Writer', description: 'Clear, engaging writing and editing assistance' },
  { id: 'analyst', title: '📊 Data Analyst', description: 'Data interpretation, stats, and visual insights' },
]

export default function Sidebar({
  model,
  onModelChange,
  onLogout = () => {},
  open = false,
  onClose = () => {},
}: SidebarProps) {
  const [selectedPrompt, setSelectedPrompt] = useState('default')
  const [temperature, setTemperature] = useState(0.7)

  return (
    <aside
      className={`
        fixed md:relative inset-y-0 left-0 z-40
        flex flex-col shrink-0
        w-[280px] md:w-[260px]
        border-r border-[#1a2228]
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{ background: '#0f1519' }}
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
      <div className="px-4 py-4 border-t border-[#1a2228] flex flex-col gap-3">
        <button
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-[#10b981] transition-all hover:shadow-[0_0_12px_#10b98144] active:scale-[0.98]"
        >
          New Chat
        </button>
        <p className="text-center text-[#475569] text-[11px]">
          Session Cost: $0.0024
        </p>
        <button
          onClick={onLogout}
          className="w-full py-2 rounded-xl text-xs text-[#475569] border border-[#1a2228] hover:border-red-500/40 hover:text-red-400 transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
