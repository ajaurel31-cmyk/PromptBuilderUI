import React, { useState } from 'react'
import type { OutputFormat, OutputMetadata } from '../../types'
import { cn, formatNumber } from '../../utils/format-helpers'
import { formatCurrency } from '../../utils/format-helpers'
import { Copy, Check, RefreshCw, Columns } from '../Icons'
import { DiffView } from './DiffView'

export interface OutputPanelProps {
  output: string
  format?: OutputFormat
  metadata?: OutputMetadata
  onRegenerate?: () => void
  compareWith?: string
  className?: string
}

const TABS: { id: OutputFormat; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'json', label: 'JSON' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'diff', label: 'Diff' },
]

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  format: initialFormat = 'text',
  metadata,
  onRegenerate,
  compareWith,
  className,
}) => {
  const [activeFormat, setActiveFormat] = useState<OutputFormat>(initialFormat)
  const [copied, setCopied] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formattedOutput = formatOutput(output, activeFormat)

  return (
    <div
      className={cn('rounded-xl overflow-hidden', className)}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--prompt-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid var(--divider)' }}
      >
        {/* Format tabs */}
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormat(tab.id)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                background:
                  activeFormat === tab.id ? 'var(--selected-bg)' : 'transparent',
                color:
                  activeFormat === tab.id
                    ? 'var(--accent-primary)'
                    : 'var(--text-tertiary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {compareWith && (
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
              style={{
                color: showCompare ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                background: showCompare ? 'var(--selected-bg)' : 'transparent',
              }}
            >
              <Columns size={12} />
              Compare
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
            style={{ color: copied ? 'var(--status-success)' : 'var(--text-tertiary)' }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--accent-primary)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-tertiary)')
              }
            >
              <RefreshCw size={12} />
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {showCompare && compareWith ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Current
              </div>
              <OutputContent content={formattedOutput} format={activeFormat} />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Previous
              </div>
              <OutputContent content={compareWith} format={activeFormat} />
            </div>
          </div>
        ) : activeFormat === 'diff' && compareWith ? (
          <DiffView oldText={compareWith} newText={output} />
        ) : (
          <OutputContent content={formattedOutput} format={activeFormat} />
        )}
      </div>

      {/* Metadata footer */}
      {metadata && (
        <div
          className="flex items-center gap-4 px-4 py-2 text-[11px]"
          style={{
            borderTop: '1px solid var(--divider)',
            color: 'var(--text-tertiary)',
          }}
        >
          {metadata.tokensUsed !== undefined && (
            <span>{formatNumber(metadata.tokensUsed)} tokens</span>
          )}
          {metadata.latencyMs !== undefined && (
            <span>{(metadata.latencyMs / 1000).toFixed(2)}s</span>
          )}
          {metadata.model && <span>{metadata.model}</span>}
          {metadata.cost !== undefined && (
            <span>{formatCurrency(metadata.cost)}</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Output Content Renderer ─── */
const OutputContent: React.FC<{ content: string; format: OutputFormat }> = ({
  content,
  format,
}) => {
  const isCode = format === 'json' || format === 'diff'

  return (
    <pre
      className={cn(
        'text-sm leading-relaxed whitespace-pre-wrap pb-scrollbar overflow-auto rounded-lg p-3',
        isCode && 'font-mono text-xs'
      )}
      style={{
        background: 'var(--surface-2)',
        color: 'var(--text-primary)',
        maxHeight: 400,
      }}
    >
      {content}
    </pre>
  )
}

/* ─── Format Helper ─── */
function formatOutput(output: string, format: OutputFormat): string {
  if (format === 'json') {
    try {
      return JSON.stringify(JSON.parse(output), null, 2)
    } catch {
      return output
    }
  }
  return output
}
