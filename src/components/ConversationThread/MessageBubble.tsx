import React, { useState } from 'react'
import type { Message } from '../../types'
import { cn } from '../../utils/format-helpers'
import { formatTokenCount } from '../../utils/token-counter'
import { Copy, Check, Bot, User } from '../Icons'
import { StreamingText } from './StreamingText'

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
  renderMarkdown?: boolean
  onCopy?: (content: string) => void
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onCopy?.(message.content)
    })
  }

  if (message.role === 'system') {
    return (
      <div
        className="flex items-start gap-2 px-4 py-3 rounded-lg mb-3 text-xs"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text-tertiary)',
          border: '1px dashed var(--prompt-border)',
        }}
      >
        <span className="font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: 'var(--token-system)' }}>
          System
        </span>
        <span className="whitespace-pre-wrap">{message.content}</span>
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: isUser ? 'var(--accent-primary)' : 'var(--surface-3)',
          color: isUser ? 'white' : 'var(--text-secondary)',
        }}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'group relative max-w-[80%] rounded-2xl px-4 py-3',
          isUser ? 'rounded-tr-md' : 'rounded-tl-md'
        )}
        style={{
          background: isUser ? 'var(--bubble-user)' : 'var(--bubble-assistant)',
          color: isUser ? 'var(--bubble-user-text)' : 'var(--bubble-assistant-text)',
        }}
      >
        {/* Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {isStreaming ? (
            <StreamingText text={message.content} />
          ) : (
            renderContent(message.content)
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            'flex items-center gap-2 mt-2 text-[10px]',
            isUser ? 'justify-end' : 'justify-start'
          )}
          style={{ opacity: 0.6 }}
        >
          {message.tokens && (
            <span>{formatTokenCount(message.tokens)} tokens</span>
          )}
          {message.model && <span>{message.model}</span>}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--prompt-border)',
            color: copied ? 'var(--status-success)' : 'var(--text-tertiary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  )
}

/* ─── Simple inline code/markdown rendering ─── */
function renderContent(content: string): React.ReactNode {
  // Split into code blocks and text
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/)

  return parts.map((part, i) => {
    // Fenced code block
    if (part.startsWith('```') && part.endsWith('```')) {
      const lines = part.slice(3, -3)
      const firstNewline = lines.indexOf('\n')
      const code = firstNewline > -1 ? lines.slice(firstNewline + 1) : lines

      return (
        <pre
          key={i}
          className="my-2 p-3 rounded-lg text-xs overflow-x-auto"
          style={{
            background: 'var(--code-bg)',
            border: '1px solid var(--code-border)',
            color: 'var(--text-primary)',
          }}
        >
          <code>{code}</code>
        </pre>
      )
    }

    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded text-xs"
          style={{
            background: 'var(--code-bg)',
            color: 'var(--accent-primary)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    // Bold text
    return part.split(/(\*\*[^*]+\*\*)/).map((segment, j) => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return <strong key={`${i}-${j}`}>{segment.slice(2, -2)}</strong>
      }
      return <span key={`${i}-${j}`}>{segment}</span>
    })
  })
}
