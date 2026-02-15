import type { Meta, StoryObj } from '@storybook/react'
import { PromptVersionHistory } from './PromptVersionHistory'
import type { PromptVersion } from '../../types'

const SAMPLE_VERSIONS: PromptVersion[] = [
  {
    id: 'v5', content: 'You are a senior TypeScript engineer. Review code for bugs, performance, and best practices. Always provide working examples.', timestamp: new Date(Date.now() - 60000),
    label: 'Added code review focus', tag: 'latest', tokens: 34,
  },
  {
    id: 'v4', content: 'You are a senior TypeScript engineer. Review code for bugs and performance issues. Provide examples when relevant.', timestamp: new Date(Date.now() - 3600000),
    label: 'Updated instructions', tokens: 28,
  },
  {
    id: 'v3', content: 'You are a TypeScript engineer. Help with code review and optimization.', timestamp: new Date(Date.now() - 86400000),
    label: 'Simplified prompt', tag: 'v1.0', tokens: 16,
  },
  {
    id: 'v2', content: 'You are an AI assistant specialized in TypeScript and React. Help users write better code.', timestamp: new Date(Date.now() - 172800000),
    label: 'Added specialization', tokens: 20,
  },
  {
    id: 'v1', content: 'You are a helpful assistant.', timestamp: new Date(Date.now() - 604800000),
    label: 'Initial version', tag: 'initial', tokens: 8,
  },
]

const meta: Meta<typeof PromptVersionHistory> = {
  title: 'Components/PromptVersionHistory',
  component: PromptVersionHistory,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 480, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PromptVersionHistory>

export const Default: Story = {
  args: {
    versions: SAMPLE_VERSIONS,
    currentVersion: 'v5',
    onRestore: (v) => alert(`Restoring: ${v.label}`),
    onCompare: (a, b) => alert(`Comparing ${a.label} with ${b.label}`),
  },
}
