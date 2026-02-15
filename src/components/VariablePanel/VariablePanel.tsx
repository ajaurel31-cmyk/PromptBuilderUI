import React from 'react'
import type { PromptVariable, VariableValues } from '../../types'
import { cn } from '../../utils/format-helpers'
import { replaceVariables } from '../../utils/variable-parser'
import { Eye } from '../Icons'

export interface VariablePanelProps {
  variables: PromptVariable[]
  values: VariableValues
  onChange: (values: VariableValues) => void
  promptText?: string
  layout?: 'inline' | 'panel'
  className?: string
}

export const VariablePanel: React.FC<VariablePanelProps> = ({
  variables,
  values,
  onChange,
  promptText,
  layout = 'panel',
  className,
}) => {
  const updateValue = (name: string, val: string | number | boolean) => {
    onChange({ ...values, [name]: val })
  }

  const preview = promptText ? replaceVariables(promptText, values) : null

  return (
    <div
      className={cn(
        'rounded-xl',
        layout === 'panel' ? 'p-5' : 'p-3',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--prompt-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Variables
        </h3>
        <span
          className="text-[11px] px-2 py-0.5 rounded-md font-medium"
          style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
        >
          {variables.length} variable{variables.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Variable inputs */}
      <div className={cn(layout === 'inline' ? 'flex flex-wrap gap-3' : 'space-y-4')}>
        {variables.map((variable) => (
          <VariableInput
            key={variable.name}
            variable={variable}
            value={values[variable.name] ?? variable.defaultValue ?? ''}
            onChange={(val) => updateValue(variable.name, val)}
            layout={layout}
          />
        ))}
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--divider)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Eye size={12} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Preview
            </span>
          </div>
          <div
            className="text-sm leading-relaxed rounded-lg p-3 whitespace-pre-wrap"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          >
            {preview}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Variable Input ─── */
interface VariableInputProps {
  variable: PromptVariable
  value: string | number | boolean
  onChange: (val: string | number | boolean) => void
  layout: 'inline' | 'panel'
}

const VariableInput: React.FC<VariableInputProps> = ({
  variable,
  value,
  onChange,
  layout,
}) => {
  const label = variable.label || variable.name.replace(/_/g, ' ')

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius)',
  }

  return (
    <div className={cn(layout === 'inline' ? 'flex-1 min-w-[180px]' : '')}>
      <label className="block mb-1.5">
        <span
          className="text-xs font-medium capitalize"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
        {variable.required && (
          <span className="text-xs ml-0.5" style={{ color: 'var(--status-error)' }}>*</span>
        )}
      </label>

      {variable.description && (
        <p className="text-[11px] mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
          {variable.description}
        </p>
      )}

      {variable.type === 'textarea' ? (
        <textarea
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm outline-none resize-none transition-colors"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
          placeholder={variable.defaultValue ? String(variable.defaultValue) : undefined}
        />
      ) : variable.type === 'select' ? (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm outline-none appearance-none cursor-pointer"
          style={inputStyle}
        >
          <option value="">Select…</option>
          {variable.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : variable.type === 'toggle' ? (
        <button
          onClick={() => onChange(!value)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            background: value ? 'var(--selected-bg)' : 'var(--surface-2)',
            color: value ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            border: `1px solid ${value ? 'var(--accent-primary)' : 'var(--input-border)'}`,
          }}
        >
          <div
            className="w-8 h-4.5 rounded-full relative transition-colors"
            style={{
              background: value ? 'var(--accent-primary)' : 'var(--surface-3)',
              padding: 2,
            }}
          >
            <div
              className="w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5"
              style={{
                left: value ? 16 : 2,
                transition: 'left var(--transition-fast)',
              }}
            />
          </div>
          <span>{value ? 'On' : 'Off'}</span>
        </button>
      ) : variable.type === 'number' ? (
        <input
          type="number"
          value={String(value)}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 text-sm outline-none transition-colors font-mono"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
        />
      ) : (
        <input
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm outline-none transition-colors"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
          placeholder={variable.defaultValue ? String(variable.defaultValue) : undefined}
        />
      )}
    </div>
  )
}
