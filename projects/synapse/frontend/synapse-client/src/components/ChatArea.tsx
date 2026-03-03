import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import Logo from './Logo'
import type { Message, ChatAreaProps } from '../types/chat'

const SAMPLE_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'user' as const,
    content: "Can you explain how React's useEffect hook works with async functions? I keep getting a warning about cleanup.",
    tokens: 24,
    cost: '$0.0001',
  },
  {
    id: 2,
    role: 'ai' as const,
    content: `Great question! The warning happens because \`useEffect\` doesn't support returning a Promise — it expects either nothing or a cleanup function.

Here's the pattern you want:

\`\`\`ts
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const data = await getUser(id);
    if (!cancelled) setUser(data);
  }

  fetchData();
  return () => { cancelled = true; };
}, [id]);
\`\`\`

The \`cancelled\` flag prevents state updates on unmounted components, which is the root cause of that warning.`,
    tokens: 118,
    cost: '$0.0003',
  },
  {
    id: 3,
    role: 'user' as const,
    content: 'That makes sense. What about using AbortController instead?',
    tokens: 12,
    cost: '$0.0001',
  },
]

const STREAMING_MESSAGE = {
  id: 4,
  role: 'ai' as const,
  content: `AbortController is the modern, cleaner approach. It works natively with \`fetch\` and many other async APIs:

\`\`\`ts
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const res = await fetch(\`/api/user/\${id}\`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err);
    }
  }

  fetchData();
  return () => controller.abort();
}, [id]);
\`\`\`

The key advantage is that it actually cancels the in-flight network request`,
  tokens: 0,
  cost: '',
}

export default function ChatArea({ model, chatId, onToggleSidebar = () => {} }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0">
      {/* Top header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1a2228] shrink-0">
        {/* Left: hamburger on mobile */}
        <div className="flex items-center flex-1">
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex flex-col gap-1.5 p-1 text-[#475569] hover:text-[#e2ede9] transition-colors"
            aria-label="Open sidebar"
          >
            <span className="block w-5 h-px bg-current rounded-full" />
            <span className="block w-5 h-px bg-current rounded-full" />
            <span className="block w-5 h-px bg-current rounded-full" />
          </button>
        </div>

        {/* Center: logo + model badge */}
        <div className="flex items-center gap-2 md:gap-3">
          <Logo size="sm" />
          <span className="text-[#6ee7b7] text-[11px] border border-[#6ee7b7] rounded-full px-2 md:px-2.5 py-0.5 font-medium whitespace-nowrap">
            {model}
          </span>
        </div>

        {/* Right: token count */}
        <div className="flex-1 flex justify-end">
          <span className="text-[#475569] text-xs tabular-nums hidden sm:block">1,243 tokens</span>
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto py-4 md:py-6 px-3 md:px-6">
        {chatId ? (
          /* Existing chat — message list */
          <div className="max-w-[760px] mx-auto flex flex-col gap-4 md:gap-5">
            {SAMPLE_MESSAGES.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                tokens={msg.tokens}
                cost={msg.cost}
              />
            ))}
            <MessageBubble
              key={STREAMING_MESSAGE.id}
              role="ai"
              content={STREAMING_MESSAGE.content}
              tokens={0}
              cost=""
              streaming={true}
            />
          </div>
        ) : (
          /* New chat — welcome state */
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-4">
            <Logo size="lg" />
            <p className="text-[#475569] text-sm mt-1">
              Start a conversation to create a new chat.
            </p>
          </div>
        )}
      </div>

      {/* Input bar */}
      <InputBar streaming={false} />
    </div>
  )
}
