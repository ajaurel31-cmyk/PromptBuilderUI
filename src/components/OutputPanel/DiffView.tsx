import React from 'react'
import { computeDiff, type DiffLine } from '../../utils/diff-engine'

interface DiffViewProps {
  oldText: string
  newText: string
}

export const DiffView: React.FC<DiffViewProps> = ({ oldText, newText }) => {
  const lines = computeDiff(oldText, newText)

  return (
    <div
      className="font-mono text-xs leading-relaxed rounded-lg overflow-auto"
      style={{ background: 'var(--surface-1)' }}
    >
      {lines.map((line, i) => (
        <DiffLineRow key={i} line={line} />
      ))}
    </div>
  )
}

const DiffLineRow: React.FC<{ line: DiffLine }> = ({ line }) => {
  const bgColor =
    line.type === 'added'
      ? 'rgba(16, 185, 129, 0.1)'
      : line.type === 'removed'
      ? 'rgba(239, 68, 68, 0.1)'
      : 'transparent'

  const textColor =
    line.type === 'added'
      ? 'var(--status-success)'
      : line.type === 'removed'
      ? 'var(--status-error)'
      : 'var(--text-secondary)'

  const prefix =
    line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '

  return (
    <div
      className="flex px-3 py-0.5"
      style={{ background: bgColor }}
    >
      <span
        className="w-6 flex-shrink-0 select-none text-right pr-2"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {line.lineNumber ?? ''}
      </span>
      <span
        className="w-4 flex-shrink-0 select-none"
        style={{ color: textColor }}
      >
        {prefix}
      </span>
      <span style={{ color: textColor }}>{line.content}</span>
    </div>
  )
}
