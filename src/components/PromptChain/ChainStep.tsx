import React from 'react'
import type { ChainStep as ChainStepType, ChainStepStatus } from '../../types'
import { cn } from '../../utils/format-helpers'
import { formatTokenCount } from '../../utils/token-counter'
import { GripVertical, Play, Trash, Check, X as XIcon } from '../Icons'

interface ChainStepProps {
  step: ChainStepType
  index: number
  isLast: boolean
  layout: 'vertical' | 'horizontal'
  onEdit: (step: ChainStepType) => void
  onDelete: () => void
  onRun: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  isDragging: boolean
}

const STATUS_STYLES: Record<ChainStepStatus, { color: string; bg: string; label: string }> = {
  pending: { color: 'var(--text-tertiary)', bg: 'var(--surface-3)', label: 'Pending' },
  running: { color: 'var(--accent-primary)', bg: 'var(--selected-bg)', label: 'Running' },
  complete: { color: 'var(--status-success)', bg: 'rgba(16, 185, 129, 0.1)', label: 'Complete' },
  error: { color: 'var(--status-error)', bg: 'rgba(239, 68, 68, 0.1)', label: 'Error' },
}

export const ChainStepComponent: React.FC<ChainStepProps> = ({
  step,
  index,
  isLast,
  layout,
  onEdit,
  onDelete,
  onRun,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}) => {
  const status = STATUS_STYLES[step.status]

  return (
    <div
      className={cn(
        'relative',
        layout === 'horizontal' ? 'flex items-start gap-3' : ''
      )}
    >
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        className={cn(
          'group rounded-xl p-4 transition-all duration-150',
          layout === 'horizontal' ? 'w-72' : 'w-full'
        )}
        style={{
          background: 'var(--surface-2)',
          border: `1px solid ${isDragging ? 'var(--accent-primary)' : 'var(--prompt-border)'}`,
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <GripVertical
            size={14}
            className="cursor-grab flex-shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <span
            className="text-[10px] font-bold w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: status.bg, color: status.color }}
          >
            {index + 1}
          </span>
          <input
            value={step.label}
            onChange={(e) => onEdit({ ...step, label: e.target.value })}
            className="flex-1 text-sm font-medium bg-transparent outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {/* Status indicator */}
          <span
            className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md"
            style={{ background: status.bg, color: status.color }}
          >
            {step.status === 'running' && (
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: status.color }} />
            )}
            {step.status === 'complete' && <Check size={10} />}
            {step.status === 'error' && <XIcon size={10} />}
            {status.label}
          </span>
        </div>

        {/* Prompt input */}
        <textarea
          value={step.prompt}
          onChange={(e) => onEdit({ ...step, prompt: e.target.value })}
          rows={3}
          placeholder="Enter step prompt…"
          className="w-full resize-none text-xs font-mono leading-relaxed outline-none p-2 rounded-lg mb-2"
          style={{
            background: 'var(--surface-0)',
            color: 'var(--text-primary)',
            border: '1px solid var(--input-border)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
        />

        {/* Output variable */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            Output →
          </span>
          <input
            value={step.outputVariable || ''}
            onChange={(e) => onEdit({ ...step, outputVariable: e.target.value })}
            placeholder="variable_name"
            className="flex-1 text-[11px] font-mono px-2 py-1 rounded-md outline-none"
            style={{
              background: 'var(--badge-bg)',
              color: 'var(--badge-text)',
              border: '1px solid transparent',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          />
        </div>

        {/* Output preview */}
        {step.output && (
          <div
            className="text-[11px] font-mono p-2 rounded-lg mb-2 max-h-20 overflow-auto pb-scrollbar"
            style={{ background: 'var(--surface-0)', color: 'var(--text-secondary)' }}
          >
            {step.output}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step.tokens && (
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                {formatTokenCount(step.tokens)} tokens
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onRun}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors"
              style={{ color: 'var(--status-success)' }}
            >
              <Play size={10} />
              Run
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              style={{ color: 'var(--status-error)' }}
            >
              <Trash size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Connector */}
      {!isLast && (
        <div
          className={cn(
            'flex items-center justify-center',
            layout === 'vertical' ? 'py-2' : 'self-center'
          )}
        >
          {layout === 'vertical' ? (
            <div className="w-0.5 h-6" style={{ background: 'var(--prompt-border)' }} />
          ) : (
            <div className="h-0.5 w-6" style={{ background: 'var(--prompt-border)' }} />
          )}
        </div>
      )}
    </div>
  )
}
