import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PromptComposer } from './PromptComposer'
import type { SlashCommand, Mention } from '../../types'

const SAMPLE_COMMANDS: SlashCommand[] = [
  { id: 'translate', label: 'translate', description: 'Translate text to another language', insert: 'Translate the following to {{language}}:\n\n' },
  { id: 'summarize', label: 'summarize', description: 'Summarize text concisely', insert: 'Summarize the following in {{length}} sentences:\n\n' },
  { id: 'code', label: 'code', description: 'Generate code snippet', insert: 'Write a {{language}} function that ' },
  { id: 'explain', label: 'explain', description: 'Explain a concept', insert: 'Explain the following concept in simple terms:\n\n' },
]

const SAMPLE_MENTIONS: Mention[] = [
  { id: 'readme', label: 'README.md', type: 'file' },
  { id: 'api', label: 'api/routes.ts', type: 'file' },
  { id: 'docs', label: 'docs.example.com', type: 'url' },
  { id: 'db', label: 'users_table', type: 'data' },
]

const meta: Meta<typeof PromptComposer> = {
  title: 'Components/PromptComposer',
  component: PromptComposer,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 560, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PromptComposer>

const Interactive = () => {
  const [value, setValue] = useState('')
  return (
    <PromptComposer
      value={value}
      onChange={setValue}
      onSubmit={(v) => alert(`Submitted: ${v}`)}
      maxTokens={4096}
      slashCommands={SAMPLE_COMMANDS}
      mentions={SAMPLE_MENTIONS}
    />
  )
}

export const Default: Story = {
  render: () => <Interactive />,
}

const WithVariables = () => {
  const [value, setValue] = useState(
    'You are a {{role}} expert. Please help me with {{task}} using {{language}}.'
  )
  return (
    <PromptComposer
      value={value}
      onChange={setValue}
      onSubmit={(v) => alert(v)}
      maxTokens={4096}
      variables={['role', 'task', 'language']}
      slashCommands={SAMPLE_COMMANDS}
    />
  )
}

export const WithVariablesHighlighted: Story = {
  render: () => <WithVariables />,
}

export const EmptyState: Story = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Type / for commands, @ for mentions…',
    maxTokens: 8192,
  },
}
