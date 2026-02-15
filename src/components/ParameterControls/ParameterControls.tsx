import React, { useState } from 'react'
import type { ModelParameters, ParameterPreset } from '../../types'
import { cn } from '../../utils/format-helpers'
import { ChevronDown, ChevronUp, Zap, Sliders, Code, Sparkles } from '../Icons'

export interface ParameterControlsProps {
  values: ModelParameters
  onChange: (values: ModelParameters) => void
  presets?: ParameterPreset[]
  showAdvanced?: boolean
  className?: string
}

const DEFAULT_PRESETS: ParameterPreset[] = [
  {
    id: 'precise',
    label: 'Precise',
    values: { temperature: 0.2, topP: 0.9, frequencyPenalty: 0, presencePenalty: 0 },
  },
  {
    id: 'balanced',
    label: 'Balanced',
    values: { temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0 },
  },
  {
    id: 'creative',
    label: 'Creative',
    values: { temperature: 1.2, topP: 1, frequencyPenalty: 0.3, presencePenalty: 0.3 },
  },
  {
    id: 'code',
    label: 'Code',
    values: { temperature: 0.1, topP: 0.95, frequencyPenalty: 0, presencePenalty: 0 },
  },
]

const PRESET_ICONS: Record<string, React.ReactNode> = {
  precise: <Zap size={14} />,
  balanced: <Sliders size={14} />,
  creative: <Sparkles size={14} />,
  code: <Code size={14} />,
}

function getTemperatureLabel(value: number): string {
  if (value <= 0.3) return 'Precise'
  if (value <= 0.8) return 'Balanced'
  if (value <= 1.3) return 'Creative'
  return 'Wild'
}

function getTemperatureColor(value: number): string {
  if (value <= 0.3) return 'var(--token-user)'
  if (value <= 0.8) return 'var(--status-success)'
  if (value <= 1.3) return 'var(--status-warning)'
  return 'var(--status-error)'
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  values,
  onChange,
  presets = DEFAULT_PRESETS,
  showAdvanced: initialShowAdvanced = false,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(initialShowAdvanced)

  const update = (key: keyof ModelParameters, val: number) => {
    onChange({ ...values, ...{ [key]: val } })
  }

  const applyPreset = (preset: ParameterPreset) => {
    onChange({ ...values, ...preset.values })
  }

  return (
    <div
      className={cn('rounded-xl p-5', className)}
      style={{ background: 'var(--surface-1)', border: '1px solid var(--prompt-border)' }}
    >
      {/* Presets */}
      <div className="mb-5">
        <label
          className="block text-xs font-medium mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          Presets
        </label>
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--prompt-border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--selected-bg)'
                e.currentTarget.style.color = 'var(--accent-primary)'
                e.currentTarget.style.borderColor = 'var(--accent-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-2)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.borderColor = 'var(--prompt-border)'
              }}
            >
              {PRESET_ICONS[preset.id] || <Sliders size={14} />}
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <SliderControl
        label="Temperature"
        value={values.temperature}
        min={0}
        max={2}
        step={0.1}
        onChange={(v) => update('temperature', v)}
        badge={getTemperatureLabel(values.temperature)}
        badgeColor={getTemperatureColor(values.temperature)}
      />

      {/* Max Tokens */}
      <SliderControl
        label="Max Tokens"
        value={values.maxTokens}
        min={1}
        max={16384}
        step={1}
        onChange={(v) => update('maxTokens', v)}
        formatValue={(v) => v.toLocaleString()}
      />

      {/* Top P */}
      <SliderControl
        label="Top P"
        value={values.topP}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => update('topP', v)}
      />

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 mt-2 mb-1 text-xs font-medium transition-colors"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
      >
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        Advanced
      </button>

      {/* Advanced parameters */}
      {showAdvanced && (
        <div className="mt-2 pt-3" style={{ borderTop: '1px solid var(--divider)' }}>
          <SliderControl
            label="Frequency Penalty"
            value={values.frequencyPenalty}
            min={0}
            max={2}
            step={0.1}
            onChange={(v) => update('frequencyPenalty', v)}
          />
          <SliderControl
            label="Presence Penalty"
            value={values.presencePenalty}
            min={0}
            max={2}
            step={0.1}
            onChange={(v) => update('presencePenalty', v)}
          />
        </div>
      )}
    </div>
  )
}

/* ─── Slider Sub-component ─── */
interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  badge?: string
  badgeColor?: string
  formatValue?: (v: number) => string
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  badge,
  badgeColor,
  formatValue,
}) => {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
          {badge && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
              style={{ background: `${badgeColor}20`, color: badgeColor }}
            >
              {badge}
            </span>
          )}
        </div>
        <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
          {formatValue ? formatValue(value) : value.toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div
          className="absolute w-full h-1.5 rounded-full"
          style={{ background: 'var(--slider-track)' }}
        />
        <div
          className="absolute h-1.5 rounded-full transition-all duration-100"
          style={{
            width: `${pct}%`,
            background: badgeColor || 'var(--slider-fill)',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-6 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute w-4 h-4 rounded-full border-2 shadow-sm transition-all duration-100 pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            background: 'var(--slider-thumb)',
            borderColor: badgeColor || 'var(--slider-fill)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  )
}
