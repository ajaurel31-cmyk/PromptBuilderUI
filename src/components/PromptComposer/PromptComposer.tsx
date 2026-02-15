import React, { useRef, useCallback, useEffect, useState } from 'react'
import type { SlashCommand, Mention } from '../../types'
import { cn } from '../../utils/format-helpers'
import { formatTokenCount, estimateTokens } from '../../utils/token-counter'
import { useSlashCommands } from './useSlashCommands'
import { Send, Code, FileText } from '../Icons'

export interface PromptComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  maxTokens?: number
  variables?: string[]
  slashCommands?: SlashCommand[]
  mentions?: Mention[]
  placeholder?: string
  className?: string
}

const MENTION_ICONS: Record<string, React.ReactNode> = {
  file: <FileText size={12} />,
  url: <Code size={12} />,
  data: <Code size={12} />,
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  value,
  onChange,
  onSubmit,
  maxTokens,
  variables = [],
  slashCommands = [],
  mentions = [],
  placeholder = 'Write your prompt here… Use / for commands, @ for mentions, and {{variables}} for templates.',
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionIndex, setMentionIndex] = useState(0)

  const slash = useSlashCommands(slashCommands)
  const tokenCount = estimateTokens(value)

  // Auto-expand textarea
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  const filteredMentions = mentions.filter(
    (m) =>
      !mentionQuery ||
      m.label.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    onChange(val)

    // Check for / trigger at the start or after whitespace
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = val.slice(0, cursorPos)
    const slashMatch = textBeforeCursor.match(/(^|\s)\/(\w*)$/)
    if (slashMatch) {
      slash.open(slashMatch[2])
    } else if (slash.isOpen) {
      slash.close()
    }

    // Check for @ trigger
    const mentionMatch = textBeforeCursor.match(/(^|\s)@(\w*)$/)
    if (mentionMatch && mentions.length > 0) {
      setMentionOpen(true)
      setMentionQuery(mentionMatch[2])
      setMentionIndex(0)
    } else {
      setMentionOpen(false)
    }
  }

  const insertSlashCommand = (cmd: SlashCommand) => {
    const el = textareaRef.current
    if (!el) return
    const pos = el.selectionStart
    const textBefore = value.slice(0, pos)
    const textAfter = value.slice(pos)
    const slashStart = textBefore.lastIndexOf('/')
    const newValue = textBefore.slice(0, slashStart) + cmd.insert + textAfter
    onChange(newValue)
    slash.close()
    setTimeout(() => {
      el.focus()
      const newPos = slashStart + cmd.insert.length
      el.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const insertMention = (mention: Mention) => {
    const el = textareaRef.current
    if (!el) return
    const pos = el.selectionStart
    const textBefore = value.slice(0, pos)
    const textAfter = value.slice(pos)
    const atStart = textBefore.lastIndexOf('@')
    const insert = `@${mention.label} `
    const newValue = textBefore.slice(0, atStart) + insert + textAfter
    onChange(newValue)
    setMentionOpen(false)
    setTimeout(() => {
      el.focus()
      const newPos = atStart + insert.length
      el.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Slash command navigation
    if (slash.isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        slash.moveSelection('down')
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        slash.moveSelection('up')
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (slash.filtered[slash.selectedIndex]) {
          insertSlashCommand(slash.filtered[slash.selectedIndex])
        }
        return
      }
      if (e.key === 'Escape') {
        slash.close()
        return
      }
    }

    // Mention navigation
    if (mentionOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex((prev) =>
          prev < filteredMentions.length - 1 ? prev + 1 : 0
        )
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredMentions.length - 1
        )
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (filteredMentions[mentionIndex]) {
          insertMention(filteredMentions[mentionIndex])
        }
        return
      }
      if (e.key === 'Escape') {
        setMentionOpen(false)
        return
      }
    }

    // Cmd+Enter to submit
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSubmit?.(value)
    }
  }

  // Render highlighted preview (variables)
  const renderHighlightedPreview = () => {
    if (!value) return null
    const parts = value.split(/(\{\{\w+\}\})/)
    return parts.map((part, i) => {
      const varMatch = part.match(/^\{\{(\w+)\}\}$/)
      if (varMatch) {
        return (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md text-xs font-medium"
            style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
          >
            {varMatch[1]}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div
      className={cn('relative rounded-xl overflow-hidden', className)}
      style={{
        background: 'var(--prompt-bg)',
        border: '1px solid var(--prompt-border)',
        transition: 'border-color var(--transition-fast)',
      }}
    >
      {/* Variable highlight preview (shown above textarea when variables exist) */}
      {variables.length > 0 && value && (
        <div
          className="px-4 pt-3 pb-0 text-sm leading-relaxed whitespace-pre-wrap pointer-events-none"
          style={{ color: 'var(--prompt-text)' }}
        >
          {renderHighlightedPreview()}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className={cn(
          'w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed outline-none',
          variables.length > 0 && value && 'sr-only'
        )}
        style={{
          color: 'var(--prompt-text)',
          caretColor: 'var(--accent-primary)',
          minHeight: variables.length > 0 && value ? 0 : 100,
        }}
        onFocus={(e) => {
          const parent = e.currentTarget.closest('div[class*="rounded-xl"]') as HTMLElement
          if (parent) parent.style.borderColor = 'var(--accent-primary)'
        }}
        onBlur={(e) => {
          const parent = e.currentTarget.closest('div[class*="rounded-xl"]') as HTMLElement
          if (parent) parent.style.borderColor = 'var(--prompt-border)'
        }}
      />

      {/* The visible textarea for when variable preview is shown */}
      {variables.length > 0 && value && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full resize-none bg-transparent px-4 pb-3 text-sm leading-relaxed outline-none"
          style={{
            color: 'transparent',
            caretColor: 'var(--accent-primary)',
            minHeight: 60,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: '1px solid var(--divider)' }}
      >
        <div
          className="flex items-center gap-3 text-[11px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span className="font-mono">
            {formatTokenCount(tokenCount)} tokens
          </span>
          {maxTokens && (
            <span
              style={{
                color:
                  tokenCount > maxTokens
                    ? 'var(--status-error)'
                    : 'var(--text-tertiary)',
              }}
            >
              / {formatTokenCount(maxTokens)} max
            </span>
          )}
          <span className="hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>
            {value.length} chars
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Keyboard shortcut hint */}
          <span
            className="hidden sm:flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)' }}
          >
            ⌘↵ send
          </span>

          {/* Submit button */}
          <button
            onClick={() => onSubmit?.(value)}
            disabled={!value.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-150"
            style={{
              background: value.trim()
                ? 'var(--accent-primary)'
                : 'var(--surface-3)',
              opacity: value.trim() ? 1 : 0.5,
              cursor: value.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={12} />
            Send
          </button>
        </div>
      </div>

      {/* Slash Command Dropdown */}
      {slash.isOpen && slash.filtered.length > 0 && (
        <div
          className="absolute left-4 bottom-full mb-2 w-72 rounded-xl overflow-hidden z-50"
          style={{
            background: 'var(--dropdown-bg)',
            border: '1px solid var(--prompt-border)',
            boxShadow: 'var(--dropdown-shadow)',
          }}
        >
          <div
            className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--divider)' }}
          >
            Commands
          </div>
          {slash.filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => insertSlashCommand(cmd)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
              style={{
                background:
                  i === slash.selectedIndex ? 'var(--selected-bg)' : 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--hover-bg)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i === slash.selectedIndex ? 'var(--selected-bg)' : 'transparent')
              }
            >
              <span className="text-sm" style={{ color: 'var(--accent-primary)' }}>
                /{cmd.label}
              </span>
              {cmd.description && (
                <span className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {cmd.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mention Dropdown */}
      {mentionOpen && filteredMentions.length > 0 && (
        <div
          className="absolute left-4 bottom-full mb-2 w-64 rounded-xl overflow-hidden z-50"
          style={{
            background: 'var(--dropdown-bg)',
            border: '1px solid var(--prompt-border)',
            boxShadow: 'var(--dropdown-shadow)',
          }}
        >
          <div
            className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--divider)' }}
          >
            Mentions
          </div>
          {filteredMentions.map((mention, i) => (
            <button
              key={mention.id}
              onClick={() => insertMention(mention)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
              style={{
                background:
                  i === mentionIndex ? 'var(--selected-bg)' : 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--hover-bg)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i === mentionIndex ? 'var(--selected-bg)' : 'transparent')
              }
            >
              <span style={{ color: 'var(--accent-secondary)' }}>
                {MENTION_ICONS[mention.type]}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {mention.label}
              </span>
              <span className="text-[10px] ml-auto" style={{ color: 'var(--text-tertiary)' }}>
                {mention.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
