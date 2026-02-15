import React, { useState } from 'react'
import type { AIModel } from '../../types'
import { cn, formatNumber } from '../../utils/format-helpers'
import { Check, ChevronDown, Columns, Zap } from '../Icons'

export interface ModelSelectorProps {
  models: AIModel[]
  selected?: string
  onChange: (modelId: string) => void
  showPricing?: boolean
  showCompare?: boolean
  className?: string
}

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#10a37f',
  Anthropic: '#d97706',
  Google: '#4285f4',
  Meta: '#0668E1',
  Mistral: '#f97316',
}

const SPEED_LABELS = ['', 'Slow', 'Moderate', 'Fast', 'Very Fast', 'Ultra Fast']

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selected,
  onChange,
  showPricing = true,
  showCompare = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])

  const selectedModel = models.find((m) => m.id === selected)
  const grouped = groupByProvider(models)

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--prompt-border)',
          color: 'var(--text-primary)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--prompt-border)'
        }}
      >
        {selectedModel ? (
          <>
            <ProviderDot provider={selectedModel.provider} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{selectedModel.name}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                {selectedModel.provider} · {formatNumber(selectedModel.contextWindow)} ctx
              </div>
            </div>
            {selectedModel.recommended && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
              >
                Recommended
              </span>
            )}
          </>
        ) : (
          <span className="flex-1 text-left text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Select a model…
          </span>
        )}
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-tertiary)',
            transform: isOpen ? 'rotate(180deg)' : undefined,
            transition: 'transform 150ms',
          }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden pb-scrollbar"
            style={{
              background: 'var(--dropdown-bg)',
              border: '1px solid var(--prompt-border)',
              boxShadow: 'var(--dropdown-shadow)',
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {/* Compare toggle */}
            {showCompare && (
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ borderBottom: '1px solid var(--divider)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {compareMode ? 'Select 2 models to compare' : ''}
                </span>
                <button
                  onClick={() => {
                    setCompareMode(!compareMode)
                    setCompareIds([])
                  }}
                  className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors"
                  style={{
                    color: compareMode ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    background: compareMode ? 'var(--selected-bg)' : 'transparent',
                  }}
                >
                  <Columns size={12} />
                  Compare
                </button>
              </div>
            )}

            {Object.entries(grouped).map(([provider, providerModels]) => (
              <div key={provider}>
                <div
                  className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary)', background: 'var(--surface-1)' }}
                >
                  {provider}
                </div>
                {providerModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      if (compareMode) {
                        toggleCompare(model.id)
                      } else {
                        onChange(model.id)
                        setIsOpen(false)
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{
                      background:
                        model.id === selected
                          ? 'var(--selected-bg)'
                          : compareIds.includes(model.id)
                          ? 'var(--hover-bg)'
                          : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (model.id !== selected)
                        e.currentTarget.style.background = 'var(--hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                      if (model.id !== selected && !compareIds.includes(model.id))
                        e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <ProviderDot provider={model.provider} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-medium truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {model.name}
                        </span>
                        {model.recommended && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0"
                            style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
                          >
                            Recommended
                          </span>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-3 text-[11px] mt-0.5"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span>{formatNumber(model.contextWindow)} tokens</span>
                        {model.speedRating && (
                          <span className="flex items-center gap-0.5">
                            <Zap size={10} />
                            {SPEED_LABELS[model.speedRating]}
                          </span>
                        )}
                        {showPricing && model.pricePerInputToken && (
                          <span>
                            ${(model.pricePerInputToken * 1_000_000).toFixed(2)}/M in
                          </span>
                        )}
                      </div>
                    </div>
                    {model.id === selected && !compareMode && (
                      <Check size={16} style={{ color: 'var(--accent-primary)' }} />
                    )}
                    {compareMode && compareIds.includes(model.id) && (
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'var(--accent-primary)' }}
                      >
                        {compareIds.indexOf(model.id) + 1}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}

            {/* Compare panel */}
            {compareMode && compareIds.length === 2 && (
              <ComparePanel
                models={compareIds.map((id) => models.find((m) => m.id === id)!)}
                showPricing={showPricing}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Helpers ─── */
const ProviderDot: React.FC<{ provider: string }> = ({ provider }) => (
  <div
    className="w-3 h-3 rounded-full flex-shrink-0"
    style={{ background: PROVIDER_COLORS[provider] || '#888' }}
  />
)

const ComparePanel: React.FC<{ models: AIModel[]; showPricing: boolean }> = ({
  models,
  showPricing,
}) => (
  <div
    className="grid grid-cols-2 gap-4 p-4"
    style={{ borderTop: '1px solid var(--divider)' }}
  >
    {models.map((model) => (
      <div
        key={model.id}
        className="p-3 rounded-lg"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--prompt-border)' }}
      >
        <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {model.name}
        </div>
        <div className="space-y-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex justify-between">
            <span>Context</span>
            <span className="font-mono">{formatNumber(model.contextWindow)}</span>
          </div>
          <div className="flex justify-between">
            <span>Speed</span>
            <span>{model.speedRating ? SPEED_LABELS[model.speedRating] : 'N/A'}</span>
          </div>
          {showPricing && model.pricePerInputToken && (
            <div className="flex justify-between">
              <span>Input</span>
              <span className="font-mono">
                ${(model.pricePerInputToken * 1_000_000).toFixed(2)}/M
              </span>
            </div>
          )}
          {showPricing && model.pricePerOutputToken && (
            <div className="flex justify-between">
              <span>Output</span>
              <span className="font-mono">
                ${(model.pricePerOutputToken * 1_000_000).toFixed(2)}/M
              </span>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)

function groupByProvider(models: AIModel[]): Record<string, AIModel[]> {
  return models.reduce(
    (acc, model) => {
      ;(acc[model.provider] ??= []).push(model)
      return acc
    },
    {} as Record<string, AIModel[]>
  )
}
