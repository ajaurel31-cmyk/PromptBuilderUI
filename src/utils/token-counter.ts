/**
 * Simple token estimation using the word/4 heuristic.
 * No external dependencies required.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  // Rough heuristic: ~4 chars per token for English text
  return Math.ceil(text.length / 4)
}

export function formatTokenCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return String(count)
}

export function estimateCost(
  tokens: number,
  pricePerToken: number
): string {
  const cost = tokens * pricePerToken
  if (cost < 0.01) return '<$0.01'
  return `$${cost.toFixed(4)}`
}
