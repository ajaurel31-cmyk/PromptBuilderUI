/* ──────────────────────── Prompt Composer ──────────────────────── */
export interface SlashCommand {
  id: string
  label: string
  description?: string
  icon?: string
  insert: string
}

export interface Mention {
  id: string
  label: string
  type: 'file' | 'url' | 'data'
  icon?: string
}

/* ──────────────────────── Variables ──────────────────────── */
export interface PromptVariable {
  name: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'toggle'
  label?: string
  description?: string
  defaultValue?: string | number | boolean
  options?: string[] // for select type
  required?: boolean
}

export type VariableValues = Record<string, string | number | boolean>

/* ──────────────────────── Templates ──────────────────────── */
export interface PromptTemplate {
  id: string
  title: string
  description: string
  category: string
  content: string
  variables?: PromptVariable[]
  tags?: string[]
  starred?: boolean
  author?: string
}

/* ──────────────────────── Models ──────────────────────── */
export interface AIModel {
  id: string
  name: string
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'Mistral'
  contextWindow: number
  pricePerInputToken?: number
  pricePerOutputToken?: number
  speedRating?: 1 | 2 | 3 | 4 | 5
  recommended?: boolean
  description?: string
}

/* ──────────────────────── Parameters ──────────────────────── */
export interface ModelParameters {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

export interface ParameterPreset {
  id: string
  label: string
  icon?: string
  values: Partial<ModelParameters>
}

/* ──────────────────────── Conversation ──────────────────────── */
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  tokens?: number
  model?: string
}

/* ──────────────────────── Prompt Chain ──────────────────────── */
export type ChainStepStatus = 'pending' | 'running' | 'complete' | 'error'

export interface ChainStep {
  id: string
  label: string
  prompt: string
  model?: string
  outputVariable?: string
  status: ChainStepStatus
  output?: string
  tokens?: number
}

/* ──────────────────────── Output ──────────────────────── */
export type OutputFormat = 'text' | 'json' | 'markdown' | 'diff'

export interface OutputMetadata {
  tokensUsed?: number
  latencyMs?: number
  model?: string
  cost?: number
}

/* ──────────────────────── Version History ──────────────────────── */
export interface PromptVersion {
  id: string
  content: string
  timestamp: Date
  label?: string
  tag?: string
  tokens?: number
}

/* ──────────────────────── Few-Shot Examples ──────────────────────── */
export interface FewShotExample {
  id: string
  input: string
  output: string
  enabled: boolean
  tokens?: number
}

/* ──────────────────────── System Prompt Sections ──────────────────────── */
export interface SystemPromptSection {
  id: string
  title: string
  content: string
  collapsed?: boolean
  tokens?: number
}
