import { useRef, useState } from 'react'
import type { InputBarProps } from '../types/chat'

export default function InputBar({ streaming = false, onSubmit }: InputBarProps) {
  // State Variables
  const [text, setText] = useState('')
  const hasText = text.trim().length > 0

  // useRef
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handler Functions
  const handleSubmit = () => {
    if (!hasText){
      return;
    };
    const trimmedText = text.trim();
    onSubmit(trimmedText);
    setText('');
    if (textareaRef.current){
      textareaRef.current.style.height = 'auto';
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="sticky bottom-0 px-3 md:px-6 py-3 md:py-4"
      style={{ background: '#090d0f' }}
    >
      <div className="max-w-[760px] mx-auto flex flex-col gap-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            name='input-prompt'
            onChange={(e) => {
              setText(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            placeholder="Message Synapse..."
            className="w-full resize-none bg-[#0f1519] border border-[#1a2228] text-[#e2ede9] text-sm rounded-xl px-4 py-3 pr-14 outline-none placeholder-[#475569] focus:border-[#10b981] transition-all"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              scrollbarWidth: 'none',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 2px #10b98133'
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none'
            }}
            onKeyDown={handleKeyDown}
          />

          {/* Send / Stop button */}
          <div className="absolute right-3 bottom-3">
            {streaming ? (
              <button
                className="w-8 h-8 rounded-lg bg-[#1a2228] flex items-center justify-center border border-transparent hover:border-red-500/50 transition-all"
                title="Stop generating"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="2" width="8" height="8" rx="1" fill="#e2ede9" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasText}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
                  hasText
                    ? 'hover:scale-105 hover:shadow-[0_0_8px_#10b98166]'
                    : 'opacity-40 cursor-not-allowed'
                }`}
                style={
                  hasText
                    ? { background: 'linear-gradient(135deg, #10b981, #6ee7b7)' }
                    : { background: '#1a2228' }
                }
                title="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 12V2M7 2L3 6M7 2l4 4"
                    stroke={hasText ? '#fff' : '#475569'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[#475569] text-[11px]">
          Synapse can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  )
}