import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import Logo from './Logo'
import type { Message, ChatAreaProps } from '../types/chat'
import { createChatService, getChatMessagesService, streamMessageService } from '../services/chatServices'
import { toast } from '../utils/toast'

export default function ChatArea({ model, chatId, personaId, temperature, onToggleSidebar = () => {} }: ChatAreaProps) {
  // useNavigate
  const navigate = useNavigate();

  // State Variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // useRef
  const fromStreamRef = useRef(false);

  // SSE Parser Helper
  const parseSSE = async (response: Response) => {
    if (!response.ok){
      throw new Error(`HTTP error: ${response.status}`);
    };

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let accumulatedContent = '';
    let pendingNavigateChatId = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done){
        break;
      };

      buffer = buffer + decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const trimmed = event.trim();
        if (!trimmed || !trimmed.startsWith('data: ')){
          continue;
        };

        try {
          const parsed = JSON.parse(trimmed.slice('data: '.length));

          if (parsed.type === 'meta') {
            pendingNavigateChatId = parsed.chatId;
          }
          else if (parsed.type === 'chunk') {
            accumulatedContent = accumulatedContent + parsed.content;
            flushSync(() => setStreamingContent(accumulatedContent));
          }
          else if (parsed.type === 'done') {
            setMessages(prev => [...prev, {
              id: Date.now(),
              role: 'ai',
              content: accumulatedContent,
              tokens: parsed.tokensUsed,
              cost: parsed.cost,
            }]);
            setStreamingContent('');
            setIsStreaming(false);
            if (pendingNavigateChatId) {
              fromStreamRef.current = true;
              navigate('/chat/' + pendingNavigateChatId);
            }
          } 
          else if (parsed.type === 'error') {
            toast({ 
              variant: 'error', 
              name: 'Error', 
              description: parsed.message
            });
            setIsStreaming(false);
          }
        } 
        catch {
          // skip malformed event
        }
      }
    }
  };

  // Handler Functions
  const handleSubmit = async (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      tokens: 0,
      cost: '',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const response = chatId
        ? await streamMessageService(chatId, { message: text })
        : await createChatService({ message: text, personaId, model, temperature });

      await parseSSE(response);
    } 
    catch {
      toast({
        variant: 'error',
        name: 'Error',
        description: 'Something unexpected happened.',
      });
      setIsStreaming(false);
    };
  };

  // useEffect
  useEffect(() => {
    if (!chatId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStreamingContent('');
      return;
    };

    if (fromStreamRef.current) {
      fromStreamRef.current = false;
      return;
    }

    getChatMessagesService(chatId)
      .then((res) => setMessages(res.data.messages))
      .catch(() => toast({
        variant: 'error',
        name: 'Error',
        description: 'Could not load messages.',
      }));
  }, [chatId]);

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

      {/* Scrollable area — Step 4 */}
      <div className="flex-1 overflow-y-auto py-4 md:py-6 px-3 md:px-6">
        {(messages.length > 0 || streamingContent) ? (
          /* Message list */
          <div className="max-w-[760px] mx-auto flex flex-col gap-4 md:gap-5">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                tokens={msg.tokens}
                cost={msg.cost}
              />
            ))}
            {streamingContent && (
              <MessageBubble
                key="streaming"
                role="ai"
                content={streamingContent}
                tokens={0}
                cost=""
                streaming={true}
              />
            )}
          </div>
        ) : (
          /* Welcome state */
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-4">
            <Logo size="lg" />
            <p className="text-[#475569] text-sm mt-1">
              Start a conversation to create a new chat.
            </p>
          </div>
        )}
      </div>

      {/* Input bar */}
      <InputBar streaming={isStreaming} onSubmit={handleSubmit} />
    </div>
  )
}
