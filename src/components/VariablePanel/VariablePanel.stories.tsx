import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VariablePanel } from './VariablePanel'
import type { PromptVariable, VariableValues } from '../../types'

const SAMPLE_VARIABLES: PromptVariable[] = [
  { name: 'role', type: 'text', label: 'Role', description: 'The expert role the AI should assume', defaultValue: 'software engineer' },
  { name: 'task', type: 'textarea', label: 'Task Description', description: 'What you want the AI to help with', required: true },
  { name: 'language', type: 'select', label: 'Language', options: ['Python', 'TypeScript', 'Rust', 'Go', 'Java'] },
  { name: 'max_length', type: 'number', label: 'Max Length', description: 'Maximum words in response', defaultValue: 500 },
  { name: 'include_examples', type: 'toggle', label: 'Include Examples', defaultValue: true },
]

const meta: Meta<typeof VariablePanel> = {
  title: 'Components/VariablePanel',
  component: VariablePanel,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 380, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof VariablePanel>

const Interactive = () => {
  const [values, setValues] = useState<VariableValues>({
    role: 'software engineer',
    include_examples: true,
  })

  return (
    <VariablePanel
      variables={SAMPLE_VARIABLES}
      values={values}
      onChange={setValues}
      promptText="You are a {{role}} expert. {{task}} using {{language}}. Keep response under {{max_length}} words."
    />
  )
}

export const Default: Story = {
  render: () => <Interactive />,
}

export const InlineLayout: Story = {
  render: () => {
    const [values, setValues] = useState<VariableValues>({})
    return (
      <div style={{ width: 600 }}>
        <VariablePanel
          variables={SAMPLE_VARIABLES.slice(0, 3)}
          values={values}
          onChange={setValues}
          layout="inline"
        />
      </div>
    )
  },
}
