import React, { useState } from 'react'
import { PromptComposer } from '../components/PromptComposer/PromptComposer'
import { VariablePanel } from '../components/VariablePanel/VariablePanel'
import { PromptTemplateSelector } from '../components/PromptTemplateSelector/PromptTemplateSelector'
import { SystemPromptEditor } from '../components/SystemPromptEditor/SystemPromptEditor'
import { ModelSelector } from '../components/ModelSelector/ModelSelector'
import { ParameterControls } from '../components/ParameterControls/ParameterControls'
import { ConversationThread } from '../components/ConversationThread/ConversationThread'
import { PromptChain } from '../components/PromptChain/PromptChain'
import { OutputPanel } from '../components/OutputPanel/OutputPanel'
import { PromptVersionHistory } from '../components/PromptVersionHistory/PromptVersionHistory'
import { TokenBudgetBar } from '../components/TokenBudgetBar/TokenBudgetBar'
import { FewShotExampleManager } from '../components/FewShotExampleManager/FewShotExampleManager'
import { estimateTokens } from '../utils/token-counter'
import { extractVariables, replaceVariables } from '../utils/variable-parser'
import type {
  ModelParameters,
  Message,
  ChainStep,
  FewShotExample,
  PromptVersion,
  VariableValues,
  PromptTemplate,
} from '../types'
import {
  SAMPLE_MODELS,
  DEFAULT_PARAMS,
  SAMPLE_TEMPLATES,
  SAMPLE_SLASH_COMMANDS,
  SAMPLE_MENTIONS,
  SAMPLE_VARIABLES,
  SAMPLE_MESSAGES,
  SAMPLE_CHAIN_STEPS,
  SAMPLE_VERSIONS,
  SAMPLE_FEW_SHOT,
  SAMPLE_SYSTEM_PROMPT,
} from './sample-data'

export const FullWorkbench: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('You are a {{role}} expert. Help me with {{task}} using {{language}}.')
  const [systemPrompt, setSystemPrompt] = useState(SAMPLE_SYSTEM_PROMPT)
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4')
  const [params, setParams] = useState<ModelParameters>(DEFAULT_PARAMS)
  const [variableValues, setVariableValues] = useState<VariableValues>({
    role: 'software engineer',
    include_examples: true,
  })
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [chainSteps, setChainSteps] = useState<ChainStep[]>(SAMPLE_CHAIN_STEPS)
  const [versions, setVersions] = useState<PromptVersion[]>(SAMPLE_VERSIONS)
  const [fewShot, setFewShot] = useState<FewShotExample[]>(SAMPLE_FEW_SHOT)
  const [output, setOutput] = useState(
    'Here is a sample response that demonstrates the OutputPanel component with metadata display, format switching, and copy functionality.'
  )
  const [activeTab, setActiveTab] = useState<'compose' | 'chain'>('compose')

  const detectedVars = extractVariables(prompt)
  const systemTokens = estimateTokens(systemPrompt)
  const userTokens = estimateTokens(prompt)
  const model = SAMPLE_MODELS.find((m) => m.id === selectedModel)

  const handleSubmit = (val: string) => {
    const resolved = replaceVariables(val, variableValues)
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: resolved,
      timestamp: new Date(),
      tokens: estimateTokens(resolved),
    }
    setMessages([...messages, newMsg])

    // Simulated response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-resp`,
          role: 'assistant',
          content: `This is a simulated response to: "${resolved.slice(0, 50)}…"`,
          timestamp: new Date(),
          tokens: 24,
          model: selectedModel,
        },
      ])
    }, 500)
  }

  const handleSelectTemplate = (template: PromptTemplate) => {
    setPrompt(template.content)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--surface-0)', color: 'var(--text-primary)' }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-3 sticky top-0 z-30"
        style={{
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--divider)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'var(--accent-primary)' }}
          >
            P
          </div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Prompt Builder
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('compose')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: activeTab === 'compose' ? 'var(--selected-bg)' : 'transparent',
              color: activeTab === 'compose' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveTab('chain')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: activeTab === 'chain' ? 'var(--selected-bg)' : 'transparent',
              color: activeTab === 'chain' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}
          >
            Chain
          </button>
        </div>
      </header>

      {activeTab === 'compose' ? (
        <div className="flex gap-6 p-6 max-w-[1400px] mx-auto">
          {/* Left column - Configuration */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <ModelSelector
              models={SAMPLE_MODELS}
              selected={selectedModel}
              onChange={setSelectedModel}
              showPricing
              showCompare
            />

            <ParameterControls values={params} onChange={setParams} />

            <TokenBudgetBar
              systemTokens={systemTokens}
              userTokens={userTokens}
              maxTokens={model?.contextWindow || 4096}
            />

            <PromptVersionHistory
              versions={versions}
              currentVersion="v3"
              onRestore={(v) => setPrompt(v.content)}
              onCompare={() => {}}
            />
          </div>

          {/* Center column - Editor */}
          <div className="flex-1 min-w-0 space-y-4">
            <SystemPromptEditor
              value={systemPrompt}
              onChange={setSystemPrompt}
              maxTokens={2000}
            />

            <PromptComposer
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              maxTokens={params.maxTokens}
              variables={detectedVars}
              slashCommands={SAMPLE_SLASH_COMMANDS}
              mentions={SAMPLE_MENTIONS}
            />

            {detectedVars.length > 0 && (
              <VariablePanel
                variables={SAMPLE_VARIABLES.filter((v) =>
                  detectedVars.includes(v.name)
                )}
                values={variableValues}
                onChange={setVariableValues}
                promptText={prompt}
              />
            )}

            <FewShotExampleManager
              examples={fewShot}
              onChange={setFewShot}
              maxExamples={5}
            />

            <ConversationThread
              messages={messages}
              renderMarkdown
            />

            <OutputPanel
              output={output}
              metadata={{
                tokensUsed: 389,
                latencyMs: 2340,
                model: selectedModel,
                cost: 0.0058,
              }}
              onRegenerate={() => setOutput('Regenerated: ' + output)}
              compareWith="Previous output for comparison."
            />
          </div>

          {/* Right column - Templates */}
          <div className="w-80 flex-shrink-0">
            <PromptTemplateSelector
              templates={SAMPLE_TEMPLATES}
              onSelect={handleSelectTemplate}
              layout="list"
            />
          </div>
        </div>
      ) : (
        <div className="p-6 max-w-4xl mx-auto">
          <PromptChain
            steps={chainSteps}
            onStepChange={setChainSteps}
            onRun={(id) =>
              alert(id ? `Running step: ${id}` : 'Running all steps')
            }
          />
        </div>
      )}
    </div>
  )
}
