import type { SystemPromptCardProps } from '../types/sidebar'

export default function SystemPromptCard({
  title,
  description,
  selected,
  onClick,
}: SystemPromptCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
        selected
          ? 'border-l-[3px] border-l-[#10b981] border-[#1a2228] bg-[#10b98111]'
          : 'border-[#1a2228] bg-transparent hover:bg-[#1a222866] hover:border-l-[3px] hover:border-l-[#10b98166]'
      }`}
    >
      <p className="text-[#e2ede9] text-xs font-medium leading-snug">{title}</p>
      <p className="text-[#475569] text-[11px] mt-0.5 leading-snug">{description}</p>
    </button>
  )
}
