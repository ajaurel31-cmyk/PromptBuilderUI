import type { PromptVariable, VariableValues } from '../types'

const VARIABLE_REGEX = /\{\{(\w+)\}\}/g

export function extractVariables(text: string): string[] {
  const matches = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    matches.add(match[1])
  }
  return Array.from(matches)
}

export function replaceVariables(
  text: string,
  values: VariableValues
): string {
  return text.replace(VARIABLE_REGEX, (full, name) => {
    const val = values[name]
    if (val === undefined || val === '') return full
    return String(val)
  })
}

export function buildVariableDefinitions(
  names: string[],
  existing?: PromptVariable[]
): PromptVariable[] {
  const existingMap = new Map(existing?.map((v) => [v.name, v]))
  return names.map((name) => existingMap.get(name) ?? {
    name,
    type: 'text' as const,
    label: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  })
}
