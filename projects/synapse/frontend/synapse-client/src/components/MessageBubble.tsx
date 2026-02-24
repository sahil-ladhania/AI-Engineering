import type { MessageBubbleProps } from '../types/chat'

// ── Fix 1: parse inline code and code blocks into styled elements ──
function renderContent(text: string) {
  // Split on triple-backtick blocks first
  const blocks = text.split(/(```[\s\S]*?```)/g)

  return blocks.map((block, i) => {
    if (block.startsWith('```')) {
      const inner = block.slice(3, -3)
      const newlineIdx = inner.indexOf('\n')
      const code = newlineIdx >= 0 ? inner.slice(newlineIdx + 1) : inner
      return (
        <pre key={i} className="code-block">
          <code>{code}</code>
        </pre>
      )
    }

    // Within a text segment, handle inline backtick code
    const inlineParts = block.split(/(`[^`\n]+`)/g)
    return (
      <span key={i} className="whitespace-pre-wrap">
        {inlineParts.map((part, j) =>
          part.startsWith('`') && part.endsWith('`') ? (
            <code key={j} className="inline-code">
              {part.slice(1, -1)}
            </code>
          ) : (
            part
          )
        )}
      </span>
    )
  })
}

// ── Fix 3: Synapse logo SVG at 16px ──
function SynapseLogoSmall() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.7, flexShrink: 0, marginTop: '14px' }}
      aria-hidden="true"
    >
      <path
        d="M30 12 Q22 12 22 20 Q22 28 14 28"
        stroke="#10b981"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 16 Q22 16 22 22 Q22 28 30 28"
        stroke="#6ee7b7"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="30" cy="12" r="3" fill="#10b981" />
      <circle cx="14" cy="28" r="3" fill="#10b981" />
      <circle cx="14" cy="16" r="2" fill="#6ee7b7" opacity="0.8" />
      <circle cx="30" cy="28" r="2" fill="#6ee7b7" opacity="0.8" />
    </svg>
  )
}

export default function MessageBubble({
  role,
  content,
  tokens,
  cost,
  streaming = false,
}: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex flex-col items-end gap-1 animate-slide-up">
        <div
          className="max-w-[88%] sm:max-w-[75%] md:max-w-[70%] bg-[#1a2228] text-[#e2ede9] text-sm leading-relaxed px-4 py-3"
          style={{ borderRadius: '16px 16px 4px 16px' }}
        >
          {content}
        </div>
        <span className="text-[#475569] text-[11px] pr-1">
          {tokens} tokens · {cost}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1 animate-slide-up">
      {/* Fix 3: logo + bubble in a flex row */}
      <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%] md:max-w-[80%]">
        <SynapseLogoSmall />
        <div
          className="bg-[#0f1519] border border-[#1a2228] text-[#e2ede9] text-sm leading-relaxed px-4 py-4 min-w-0"
          style={{
            borderRadius: '16px 16px 16px 4px',
            boxShadow: '-2px 0 8px #10b98133',
          }}
        >
          {/* Fix 1: styled code blocks */}
          {renderContent(content)}
          {streaming && (
            <span className="inline-block w-0.5 h-4 bg-[#6ee7b7] ml-0.5 align-middle animate-pulse" />
          )}
        </div>
      </div>

      {/* Fix 2: bouncing dots instead of "Generating…" */}
      {streaming ? (
        <div className="flex items-center gap-1 pl-10 mt-0.5">
          <span className="dot-pulse" style={{ animationDelay: '0s' }} />
          <span className="dot-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="dot-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      ) : (
        <span className="text-[#475569] text-[11px] pl-10">
          {tokens} tokens · {cost}
        </span>
      )}
    </div>
  )
}
