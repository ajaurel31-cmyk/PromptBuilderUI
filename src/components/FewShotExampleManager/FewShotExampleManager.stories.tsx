import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FewShotExampleManager } from './FewShotExampleManager'
import type { FewShotExample } from '../../types'

const SAMPLE_EXAMPLES: FewShotExample[] = [
  {
    id: '1',
    input: 'What is the capital of France?',
    output: 'The capital of France is Paris.',
    enabled: true,
    tokens: 18,
  },
  {
    id: '2',
    input: 'What is 2 + 2?',
    output: '2 + 2 = 4',
    enabled: true,
    tokens: 12,
  },
  {
    id: '3',
    input: 'Translate "hello" to Spanish.',
    output: '"Hello" in Spanish is "hola".',
    enabled: false,
    tokens: 14,
  },
]

const meta: Meta<typeof FewShotExampleManager> = {
  title: 'Pro/FewShotExampleManager',
  component: FewShotExampleManager,
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
type Story = StoryObj<typeof FewShotExampleManager>

const Interactive = () => {
  const [examples, setExamples] = useState(SAMPLE_EXAMPLES)
  return <FewShotExampleManager examples={examples} onChange={setExamples} maxExamples={5} />
}

export const Default: Story = {
  render: () => <Interactive />,
}

export const Empty: Story = {
  render: () => {
    const [examples, setExamples] = useState<FewShotExample[]>([])
    return <FewShotExampleManager examples={examples} onChange={setExamples} />
  },
}
