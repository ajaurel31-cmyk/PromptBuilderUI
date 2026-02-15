import React, { useState } from 'react'
import type { ChainStep } from '../../types'
import { cn, generateId } from '../../utils/format-helpers'
import { Plus, Play } from '../Icons'
import { ChainStepComponent } from './ChainStep'

export interface PromptChainProps {
  steps: ChainStep[]
  onStepChange: (steps: ChainStep[]) => void
  onRun?: (stepId?: string) => void
  layout?: 'vertical' | 'horizontal'
  className?: string
}

export const PromptChain: React.FC<PromptChainProps> = ({
  steps,
  onStepChange,
  onRun,
  layout = 'vertical',
  className,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleEdit = (index: number, updated: ChainStep) => {
    const newSteps = [...steps]
    newSteps[index] = updated
    onStepChange(newSteps)
  }

  const handleDelete = (index: number) => {
    onStepChange(steps.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    const newStep: ChainStep = {
      id: generateId(),
      label: `Step ${steps.length + 1}`,
      prompt: '',
      status: 'pending',
      outputVariable: `step_${steps.length + 1}_output`,
    }
    onStepChange([...steps, newStep])
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...steps]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    onStepChange(updated)
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Prompt Chain
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </span>
          {onRun && (
            <button
              onClick={() => onRun()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Play size={12} />
              Run All
            </button>
          )}
        </div>
      </div>

      {/* Steps */}
      <div
        className={cn(
          'p-4',
          layout === 'horizontal'
            ? 'flex items-start overflow-x-auto pb-scrollbar'
            : 'space-y-0'
        )}
      >
        {steps.map((step, index) => (
          <ChainStepComponent
            key={step.id}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
            layout={layout}
            onEdit={(updated) => handleEdit(index, updated)}
            onDelete={() => handleDelete(index)}
            onRun={() => onRun?.(step.id)}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={() => setDragIndex(null)}
            isDragging={dragIndex === index}
          />
        ))}

        {/* Add step */}
        <button
          onClick={handleAdd}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition-colors',
            layout === 'horizontal'
              ? 'w-48 h-32 ml-3 flex-shrink-0'
              : 'w-full py-3 mt-2'
          )}
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
          Add Step
        </button>
      </div>
    </div>
  )
}
