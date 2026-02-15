import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SystemPromptEditor } from './SystemPromptEditor'

const SAMPLE_SYSTEM_PROMPT = `## Role
You are a senior software engineer with expertise in TypeScript, React, and system design.

## Guidelines
- Always provide working code examples
- Explain your reasoning step by step
- Consider edge cases and error handling
- Follow best practices and design patterns

## Output Format
- Use markdown formatting for code blocks
- Structure responses with clear headings
- Keep explanations concise but thorough

## Constraints
- Do not generate code that is insecure
- Always validate user input
- Consider performance implications
- Follow the principle of least surprise`

const meta: Meta<typeof SystemPromptEditor> = {
  title: 'Components/SystemPromptEditor',
  component: SystemPromptEditor,
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
type Story = StoryObj<typeof SystemPromptEditor>

const Interactive = () => {
  const [value, setValue] = useState(SAMPLE_SYSTEM_PROMPT)
  return (
    <SystemPromptEditor
      value={value}
      onChange={setValue}
      maxTokens={2000}
    />
  )
}

export const Default: Story = {
  render: () => <Interactive />,
}

export const SectionsMode: Story = {
  render: () => {
    const [value, setValue] = useState(SAMPLE_SYSTEM_PROMPT)
    return (
      <SystemPromptEditor
        value={value}
        onChange={setValue}
        maxTokens={2000}
      />
    )
  },
}
