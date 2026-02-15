import React, { useState } from 'react'
import type { PromptVersion } from '../../types'
import { cn, formatDate } from '../../utils/format-helpers'
import { formatTokenCount } from '../../utils/token-counter'
import { computeDiff } from '../../utils/diff-engine'
import { Clock, Tag, History, Check } from '../Icons'

export interface PromptVersionHistoryProps {
  versions: PromptVersion[]
  currentVersion?: string
  onRestore: (version: PromptVersion) => void
  onCompare?: (a: PromptVersion, b: PromptVersion) => void
  className?: string
}

export const PromptVersionHistory: React.FC<PromptVersionHistoryProps> = ({
  versions,
  currentVersion,
  onRestore,
  onCompare,
  className,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [compareMode, setCompareMode] = useState(false)

  const toggleSelect = (id: string) => {
    if (!compareMode) return
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    )
  }

  const compareVersions = selectedIds.length === 2
    ? [versions.find((v) => v.id === selectedIds[0])!, versions.find((v) => v.id === selectedIds[1])!]
    : null

  const diffLines = compareVersions
    ? computeDiff(compareVersions[0].content, compareVersions[1].content)
    : null

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
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--divider)' }}
      >
        <div className="flex items-center gap-2">
          <History size={14} style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Version History
          </h3>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md"
            style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
          >
            {versions.length}
          </span>
        </div>
        {onCompare && (
          <button
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedIds([])
            }}
            className="text-xs font-medium px-2 py-1 rounded-md transition-colors"
            style={{
              color: compareMode ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              background: compareMode ? 'var(--selected-bg)' : 'transparent',
            }}
          >
            {compareMode ? 'Cancel' : 'Compare'}
          </button>
        )}
      </div>

      {/* Version list */}
      <div className="divide-y" style={{ borderColor: 'var(--divider)' }}>
        {versions.map((version) => {
          const isCurrent = version.id === currentVersion
          const isSelected = selectedIds.includes(version.id)

          return (
            <div
              key={version.id}
              onClick={() => toggleSelect(version.id)}
              className={cn(
                'flex items-start gap-3 px-4 py-3 transition-colors',
                compareMode && 'cursor-pointer'
              )}
              style={{
                background: isSelected
                  ? 'var(--selected-bg)'
                  : isCurrent
                  ? 'var(--hover-bg)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isCurrent && !isSelected)
                  e.currentTarget.style.background = 'var(--hover-bg)'
              }}
              onMouseLeave={(e) => {
                if (!isCurrent && !isSelected)
                  e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Compare checkbox */}
              {compareMode && (
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--prompt-border)'}`,
                    background: isSelected ? 'var(--accent-primary)' : 'transparent',
                  }}
                >
                  {isSelected && <Check size={10} style={{ color: 'white' }} />}
                </div>
              )}

              {/* Timeline dot */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: isCurrent ? 'var(--accent-primary)' : 'var(--surface-3)',
                    border: isCurrent ? '2px solid var(--accent-primary)' : undefined,
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {version.label && (
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {version.label}
                    </span>
                  )}
                  {version.tag && (
                    <span
                      className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md"
                      style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
                    >
                      <Tag size={8} />
                      {version.tag}
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--status-success)' }}
                    >
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} />
                    {formatDate(version.timestamp)}
                  </span>
                  {version.tokens && (
                    <span className="font-mono">{formatTokenCount(version.tokens)} tokens</span>
                  )}
                </div>

                {/* Preview snippet */}
                <p
                  className="text-[11px] mt-1 line-clamp-2 font-mono"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {version.content.slice(0, 120)}
                  {version.content.length > 120 ? '…' : ''}
                </p>
              </div>

              {/* Restore button */}
              {!compareMode && !isCurrent && (
                <button
                  onClick={() => onRestore(version)}
                  className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                  style={{ color: 'var(--accent-primary)', background: 'var(--selected-bg)' }}
                >
                  Restore
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Diff view */}
      {diffLines && (
        <div className="p-4" style={{ borderTop: '1px solid var(--divider)' }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Diff
          </div>
          <div className="font-mono text-xs rounded-lg overflow-auto" style={{ background: 'var(--surface-2)', maxHeight: 300 }}>
            {diffLines.map((line, i) => {
              const bg =
                line.type === 'added' ? 'rgba(16,185,129,0.1)' :
                line.type === 'removed' ? 'rgba(239,68,68,0.1)' : 'transparent'
              const color =
                line.type === 'added' ? 'var(--status-success)' :
                line.type === 'removed' ? 'var(--status-error)' : 'var(--text-secondary)'
              const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '

              return (
                <div key={i} className="flex px-3 py-0.5" style={{ background: bg }}>
                  <span className="w-4 flex-shrink-0" style={{ color }}>{prefix}</span>
                  <span style={{ color }}>{line.content}</span>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => {
              if (compareVersions) onCompare?.(compareVersions[0], compareVersions[1])
            }}
            className="mt-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{ color: 'var(--accent-primary)', background: 'var(--selected-bg)' }}
          >
            Compare in Detail
          </button>
        </div>
      )}
    </div>
  )
}
