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
    <button
      type="button"
      onClick={onClick}
      title={description}
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
  )
}
