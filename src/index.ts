/* ─── Components ─── */
export { PromptComposer } from './components/PromptComposer/PromptComposer'
export type { PromptComposerProps } from './components/PromptComposer/PromptComposer'

export { VariablePanel } from './components/VariablePanel/VariablePanel'
export type { VariablePanelProps } from './components/VariablePanel/VariablePanel'

export { PromptTemplateSelector } from './components/PromptTemplateSelector/PromptTemplateSelector'
export type { PromptTemplateSelectorProps } from './components/PromptTemplateSelector/PromptTemplateSelector'

export { SystemPromptEditor } from './components/SystemPromptEditor/SystemPromptEditor'
export type { SystemPromptEditorProps } from './components/SystemPromptEditor/SystemPromptEditor'

export { ModelSelector } from './components/ModelSelector/ModelSelector'
export type { ModelSelectorProps } from './components/ModelSelector/ModelSelector'

export { ParameterControls } from './components/ParameterControls/ParameterControls'
export type { ParameterControlsProps } from './components/ParameterControls/ParameterControls'

export { ConversationThread } from './components/ConversationThread/ConversationThread'
export type { ConversationThreadProps } from './components/ConversationThread/ConversationThread'
export { MessageBubble } from './components/ConversationThread/MessageBubble'
export { StreamingText } from './components/ConversationThread/StreamingText'

export { PromptChain } from './components/PromptChain/PromptChain'
export type { PromptChainProps } from './components/PromptChain/PromptChain'

export { OutputPanel } from './components/OutputPanel/OutputPanel'
export type { OutputPanelProps } from './components/OutputPanel/OutputPanel'
export { DiffView } from './components/OutputPanel/DiffView'

export { PromptVersionHistory } from './components/PromptVersionHistory/PromptVersionHistory'
export type { PromptVersionHistoryProps } from './components/PromptVersionHistory/PromptVersionHistory'

export { TokenBudgetBar } from './components/TokenBudgetBar/TokenBudgetBar'
export type { TokenBudgetBarProps } from './components/TokenBudgetBar/TokenBudgetBar'

export { FewShotExampleManager } from './components/FewShotExampleManager/FewShotExampleManager'
export type { FewShotExampleManagerProps } from './components/FewShotExampleManager/FewShotExampleManager'

/* ─── Hooks ─── */
export { useTokenEstimate } from './hooks/useTokenEstimate'
export { useVariableParser } from './hooks/useVariableParser'
export { usePromptStorage } from './hooks/usePromptStorage'
export { useSlashCommands } from './components/PromptComposer/useSlashCommands'
export { useTokenCount } from './components/PromptComposer/useTokenCount'
export { useVariableDetection } from './components/VariablePanel/useVariableDetection'

/* ─── Utilities ─── */
export { estimateTokens, formatTokenCount, estimateCost } from './utils/token-counter'
export { extractVariables, replaceVariables, buildVariableDefinitions } from './utils/variable-parser'
export { computeDiff } from './utils/diff-engine'
export type { DiffLine } from './utils/diff-engine'
export { cn, formatDate, formatNumber, formatCurrency, truncate, generateId } from './utils/format-helpers'

/* ─── Icons ─── */
export * from './components/Icons'

/* ─── Types ─── */
export type {
  SlashCommand,
  Mention,
  PromptVariable,
  VariableValues,
  PromptTemplate,
  AIModel,
  ModelParameters,
  ParameterPreset,
  Message,
  ChainStepStatus,
  ChainStep,
  OutputFormat,
  OutputMetadata,
  PromptVersion,
  FewShotExample,
  SystemPromptSection,
} from './types'
