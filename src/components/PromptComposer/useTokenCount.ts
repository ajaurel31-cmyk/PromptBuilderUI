import { useMemo } from 'react'
import { estimateTokens } from '../../utils/token-counter'

export function useTokenCount(text: string): number {
  return useMemo(() => estimateTokens(text), [text])
}
