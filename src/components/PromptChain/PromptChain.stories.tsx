import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PromptChain } from './PromptChain'
import type { ChainStep } from '../../types'

const SAMPLE_STEPS: ChainStep[] = [
  {
    id: '1',
    label: 'Extract Key Points',
    prompt: 'Extract the main points from the following text:\n\n{{input_text}}',
    outputVariable: 'key_points',
    status: 'complete',
    output: '1. AI is transforming development\n2. Component libraries save time\n3. Type safety improves quality',
    tokens: 45,
  },
  {
    id: '2',
    label: 'Generate Summary',
    prompt: 'Write a concise summary based on these key points:\n\n{{key_points}}',
    outputVariable: 'summary',
    status: 'running',
    tokens: 32,
  },
  {
    id: '3',
    label: 'Create Tweet Thread',
    prompt: 'Turn this summary into a tweet thread (5 tweets):\n\n{{summary}}',
    outputVariable: 'tweets',
    status: 'pending',
  },
]

const meta: Meta<typeof PromptChain> = {
  title: 'Pro/PromptChain',
  component: PromptChain,
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
type Story = StoryObj<typeof PromptChain>

const Interactive = () => {
  const [steps, setSteps] = useState(SAMPLE_STEPS)
  return (
    <PromptChain
      steps={steps}
      onStepChange={setSteps}
      onRun={(id) => alert(id ? `Running step: ${id}` : 'Running all steps')}
    />
  )
}

export const Default: Story = {
  render: () => <Interactive />,
}

export const Horizontal: Story = {
  render: () => {
    const [steps, setSteps] = useState(SAMPLE_STEPS)
    return (
      <div style={{ width: 900 }}>
        <PromptChain
          steps={steps}
          onStepChange={setSteps}
          onRun={() => {}}
          layout="horizontal"
        />
      </div>
    )
  },
}

export const Empty: Story = {
  render: () => {
    const [steps, setSteps] = useState<ChainStep[]>([])
    return <PromptChain steps={steps} onStepChange={setSteps} onRun={() => {}} />
  },
}
