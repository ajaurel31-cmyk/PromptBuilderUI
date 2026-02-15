export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNumber?: number
}

/**
 * Simple line-based diff between two strings.
 * Uses a basic LCS approach for readable diffs.
 */
export function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: DiffLine[] = []

  const lcs = buildLCS(oldLines, newLines)

  let oi = 0
  let ni = 0
  let li = 0

  while (oi < oldLines.length || ni < newLines.length) {
    if (li < lcs.length && oi < oldLines.length && ni < newLines.length && oldLines[oi] === lcs[li] && newLines[ni] === lcs[li]) {
      result.push({ type: 'unchanged', content: oldLines[oi], lineNumber: ni + 1 })
      oi++
      ni++
      li++
    } else if (oi < oldLines.length && (li >= lcs.length || oldLines[oi] !== lcs[li])) {
      result.push({ type: 'removed', content: oldLines[oi] })
      oi++
    } else if (ni < newLines.length) {
      result.push({ type: 'added', content: newLines[ni], lineNumber: ni + 1 })
      ni++
    }
  }

  return result
}

function buildLCS(a: string[], b: string[]): string[] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const result: string[] = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return result
}
