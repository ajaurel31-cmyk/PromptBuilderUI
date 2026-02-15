import React, { useState } from 'react'
import type { FewShotExample } from '../../types'
import { cn, generateId } from '../../utils/format-helpers'
import { estimateTokens, formatTokenCount } from '../../utils/token-counter'
import { Plus, Trash, GripVertical, Wand, Eye, EyeOff } from '../Icons'

export interface FewShotExampleManagerProps {
  examples: FewShotExample[]
  onChange: (examples: FewShotExample[]) => void
  maxExamples?: number
  format?: 'chat' | 'completion'
  className?: string
}

export const FewShotExampleManager: React.FC<FewShotExampleManagerProps> = ({
  examples,
  onChange,
  maxExamples = 10,
  format = 'chat',
  className,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const totalTokens = examples
    .filter((e) => e.enabled)
    .reduce(
      (sum, e) => sum + (e.tokens || estimateTokens(e.input + e.output)),
      0
    )

  const addExample = () => {
    if (examples.length >= maxExamples) return
    onChange([
      ...examples,
      {
        id: generateId(),
        input: '',
        output: '',
        enabled: true,
        tokens: 0,
      },
    ])
  }

  const updateExample = (index: number, updates: Partial<FewShotExample>) => {
    const updated = [...examples]
    updated[index] = { ...updated[index], ...updates }
    if (updates.input !== undefined || updates.output !== undefined) {
      updated[index].tokens = estimateTokens(
        updated[index].input + updated[index].output
      )
    }
    onChange(updated)
  }

  const deleteExample = (index: number) => {
    onChange(examples.filter((_, i) => i !== index))
  }

  const toggleExample = (index: number) => {
    updateExample(index, { enabled: !examples[index].enabled })
  }

  const autoFormat = () => {
    const formatted = examples.map((e) => ({
      ...e,
      input: e.input.trim(),
      output: e.output.trim(),
    }))
    onChange(formatted)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...examples]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    onChange(updated)
    setDragIndex(index)
  }

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
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Few-Shot Examples
          </h3>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md"
            style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
          >
            {examples.filter((e) => e.enabled).length}/{examples.length}
          </span>
          <span
            className="text-[10px] font-mono"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {formatTokenCount(totalTokens)} tokens
          </span>
        </div>
        <button
          onClick={autoFormat}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          <Wand size={12} />
          Auto-format
        </button>
      </div>

      {/* Examples */}
      <div className="p-4 space-y-3">
        {examples.map((example, index) => (
          <div
            key={example.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={() => setDragIndex(null)}
            className="group rounded-xl overflow-hidden transition-all duration-150"
            style={{
              background: 'var(--surface-2)',
              border: `1px solid ${dragIndex === index ? 'var(--accent-primary)' : 'var(--prompt-border)'}`,
              opacity: dragIndex === index ? 0.5 : example.enabled ? 1 : 0.5,
            }}
          >
            {/* Example header */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: '1px solid var(--divider)' }}
            >
              <GripVertical
                size={14}
                className="cursor-grab flex-shrink-0"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <span
                className="text-[10px] font-bold w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
              >
                {index + 1}
              </span>
              <span className="flex-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Example {index + 1}
              </span>
              {example.tokens !== undefined && example.tokens > 0 && (
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                  {formatTokenCount(example.tokens)}
                </span>
              )}
              <button
                onClick={() => toggleExample(index)}
                className="p-1 rounded transition-colors"
                style={{ color: example.enabled ? 'var(--status-success)' : 'var(--text-tertiary)' }}
              >
                {example.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => deleteExample(index)}
                className="p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                style={{ color: 'var(--status-error)' }}
              >
                <Trash size={14} />
              </button>
            </div>

            {/* Input / Output */}
            <div className={cn(format === 'chat' ? 'grid grid-cols-2 divide-x' : 'space-y-0')} style={{ borderColor: 'var(--divider)' }}>
              <div className="p-3">
                <label
                  className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--token-user)' }}
                >
                  Input
                </label>
                <textarea
                  value={example.input}
                  onChange={(e) => updateExample(index, { input: e.target.value })}
                  rows={3}
                  placeholder="Example input…"
                  className="w-full resize-none text-xs font-mono leading-relaxed outline-none p-2 rounded-lg"
                  style={{
                    background: 'var(--surface-0)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--input-border)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
                />
              </div>
              <div className="p-3">
                <label
                  className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--token-response)' }}
                >
                  Output
                </label>
                <textarea
                  value={example.output}
                  onChange={(e) => updateExample(index, { output: e.target.value })}
                  rows={3}
                  placeholder="Expected output…"
                  className="w-full resize-none text-xs font-mono leading-relaxed outline-none p-2 rounded-lg"
                  style={{
                    background: 'var(--surface-0)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--input-border)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add button */}
        {examples.length < maxExamples && (
          <button
            onClick={addExample}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors"
            style={{
              border: '1px dashed var(--prompt-border)',
              color: 'var(--text-tertiary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--prompt-border)'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <Plus size={14} />
            Add Example ({examples.length}/{maxExamples})
          </button>
        )}
      </div>
    </div>
  )
}
