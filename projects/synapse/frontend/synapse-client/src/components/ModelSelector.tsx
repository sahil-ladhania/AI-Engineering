import type { ModelSelectorProps } from '../types/sidebar'

const models = ['gpt-4o-mini', 'gpt-4o']

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#475569] text-[11px] uppercase tracking-wider font-medium">
        Model
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#0f1519] border border-[#1a2228] text-[#e2ede9] text-xs rounded-lg px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-[#10b981] focus:shadow-[0_0_0_2px_#10b98133] transition-all"
        >
          {models.map((m) => (
            <option key={m} value={m} className="bg-[#0f1519]">
              {m}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
