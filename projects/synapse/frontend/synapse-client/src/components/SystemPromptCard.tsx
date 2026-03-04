import type { SystemPromptCardProps } from '../types/sidebar'

export default function SystemPromptCard({
  title,
  description,
  selected,
  onClick,
}: SystemPromptCardProps) {
  const emojiMatch = title.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u)
  const emoji = emojiMatch ? emojiMatch[0].trim() : ''
  const label = title.replace(emojiMatch?.[0] ?? '', '').trim()

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          selected
            ? 'bg-[#10b98112] border-l-2 border-l-[#10b981] pl-[10px]'
            : 'border-l-2 border-l-transparent hover:bg-[#ffffff07] hover:border-l-[#1e3a30]'
        }`}
      >
        <span className="text-sm shrink-0 leading-none">{emoji}</span>
        <span className={`text-[12.5px] leading-none ${selected ? 'text-[#6ee7b7] font-medium' : 'text-[#7a8fa6]'}`}>
          {label}
        </span>
      </button>

      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-3 mb-1.5 z-50 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-[#161f26] border border-[#1e2d38] rounded-lg px-3 py-2 shadow-xl">
          <p className="text-[11px] text-[#8099a8] leading-snug">{description}</p>
        </div>
      </div>
    </div>
  )
}
