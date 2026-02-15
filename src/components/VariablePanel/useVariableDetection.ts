import { useMemo } from 'react'
import { extractVariables, buildVariableDefinitions } from '../../utils/variable-parser'
import type { PromptVariable } from '../../types'

export function useVariableDetection(
  promptText: string,
  existingDefs?: PromptVariable[]
): PromptVariable[] {
  return useMemo(() => {
    const names = extractVariables(promptText)
    return buildVariableDefinitions(names, existingDefs)
  }, [promptText, existingDefs])
}
