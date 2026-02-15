import { useMemo } from 'react'
import { extractVariables } from '../utils/variable-parser'

export function useVariableParser(text: string): string[] {
  return useMemo(() => extractVariables(text), [text])
}
