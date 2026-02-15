import React, { useRef, useEffect } from 'react'
import type { Message } from '../../types'
import { cn } from '../../utils/format-helpers'
import { MessageBubble } from './MessageBubble'

export interface ConversationThreadProps {
  messages: Message[]
  onCopy?: (content: string) => void
  isStreaming?: boolean
  renderMarkdown?: boolean
  className?: string
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  messages,
  onCopy,
  isStreaming = false,
  renderMarkdown = true,
  className,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  // Separate system messages
  const systemMessages = messages.filter((m) => m.role === 'system')
  const chatMessages = messages.filter((m) => m.role !== 'system')

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl overflow-hidden',
        className
      )}
      style={{
        background: 'var(--surface-0)',
        border: '1px solid var(--prompt-border)',
      }}
    >
      {/* System messages (pinned top) */}
      {systemMessages.length > 0 && (
        <div
          className="px-4 py-2"
          style={{ borderBottom: '1px solid var(--divider)' }}
        >
          {systemMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-scrollbar" style={{ minHeight: 200, maxHeight: 500 }}>
        {chatMessages.length === 0 && (
          <div
            className="flex items-center justify-center h-full text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            No messages yet. Start a conversation!
          </div>
        )}
        {chatMessages.map((msg, i) => {
          const isLast = i === chatMessages.length - 1
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={isLast && isStreaming && msg.role === 'assistant'}
              renderMarkdown={renderMarkdown}
              onCopy={onCopy}
            />
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
