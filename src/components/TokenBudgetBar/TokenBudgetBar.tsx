import React from 'react'
import { cn } from '../../utils/format-helpers'
import { formatTokenCount } from '../../utils/token-counter'

export interface TokenBudgetBarProps {
  systemTokens: number
  userTokens: number
  maxTokens: number
  warningThreshold?: number
  className?: string
}

export const TokenBudgetBar: React.FC<TokenBudgetBarProps> = ({
  systemTokens,
  userTokens,
  maxTokens,
  warningThreshold = 0.85,
  className,
}) => {
  const responseTokens = Math.max(0, maxTokens - systemTokens - userTokens)
  const totalUsed = systemTokens + userTokens
  const usageRatio = totalUsed / maxTokens
  const isWarning = usageRatio >= warningThreshold
  const isOverBudget = usageRatio > 1

  const systemPct = Math.min((systemTokens / maxTokens) * 100, 100)
  const userPct = Math.min((userTokens / maxTokens) * 100, 100 - systemPct)
  const responsePct = Math.max(0, 100 - systemPct - userPct)

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Token Budget
        </span>
        <span
          className={cn(
            'text-xs font-mono font-medium',
            isOverBudget && 'animate-pulse'
          )}
          style={{
            color: isOverBudget
              ? 'var(--status-error)'
              : isWarning
              ? 'var(--status-warning)'
              : 'var(--text-secondary)',
          }}
        >
          {formatTokenCount(totalUsed)} / {formatTokenCount(maxTokens)}
        </span>
      </div>

      {/* Bar */}
      <div
        className="relative w-full h-3 rounded-full overflow-hidden"
        style={{ background: 'var(--surface-2)' }}
      >
        <div className="absolute inset-0 flex h-full">
          {/* System segment */}
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${systemPct}%`,
              background: 'var(--token-system)',
            }}
          />
          {/* User segment */}
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${userPct}%`,
              background: 'var(--token-user)',
            }}
          />
          {/* Response segment (remaining) */}
          {responsePct > 0 && (
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${responsePct}%`,
                background: 'var(--token-response)',
                opacity: 0.25,
              }}
            />
          )}
        </div>

        {/* Warning overlay */}
        {isOverBudget && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'var(--status-error)',
              opacity: 0.15,
            }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <LegendItem
          color="var(--token-system)"
          label="System"
          tokens={systemTokens}
        />
        <LegendItem
          color="var(--token-user)"
          label="Prompt"
          tokens={userTokens}
        />
        <LegendItem
          color="var(--token-response)"
          label="Response"
          tokens={responseTokens}
          muted
        />
      </div>
    </div>
  )
}

const LegendItem: React.FC<{
  color: string
  label: string
  tokens: number
  muted?: boolean
}> = ({ color, label, tokens, muted }) => (
  <div className="flex items-center gap-1.5">
    <div
      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
      style={{ background: color, opacity: muted ? 0.4 : 1 }}
    />
    <span
      className="text-[11px]"
      style={{ color: 'var(--text-tertiary)' }}
    >
      {label}
    </span>
    <span
      className="text-[11px] font-mono font-medium"
      style={{ color: 'var(--text-secondary)' }}
    >
      {formatTokenCount(tokens)}
    </span>
  </div>
)
