import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ModelSelector } from './ModelSelector'
import type { AIModel } from '../../types'

const SAMPLE_MODELS: AIModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', contextWindow: 128000, pricePerInputToken: 0.0000025, pricePerOutputToken: 0.00001, speedRating: 4, recommended: true },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', contextWindow: 128000, pricePerInputToken: 0.00000015, pricePerOutputToken: 0.0000006, speedRating: 5 },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', contextWindow: 200000, pricePerInputToken: 0.000003, pricePerOutputToken: 0.000015, speedRating: 4, recommended: true },
  { id: 'claude-haiku-3.5', name: 'Claude 3.5 Haiku', provider: 'Anthropic', contextWindow: 200000, pricePerInputToken: 0.0000008, pricePerOutputToken: 0.000004, speedRating: 5 },
  { id: 'gemini-2-pro', name: 'Gemini 2.0 Pro', provider: 'Google', contextWindow: 2000000, pricePerInputToken: 0.00000125, pricePerOutputToken: 0.000005, speedRating: 4 },
  { id: 'gemini-2-flash', name: 'Gemini 2.0 Flash', provider: 'Google', contextWindow: 1000000, pricePerInputToken: 0.0000001, pricePerOutputToken: 0.0000004, speedRating: 5 },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta', contextWindow: 128000, speedRating: 4 },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', contextWindow: 128000, pricePerInputToken: 0.000002, pricePerOutputToken: 0.000006, speedRating: 3 },
]

const meta: Meta<typeof ModelSelector> = {
  title: 'Pro/ModelSelector',
  component: ModelSelector,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 400, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ModelSelector>

const Interactive = () => {
  const [selected, setSelected] = useState('claude-sonnet-4')
  return (
    <ModelSelector
      models={SAMPLE_MODELS}
      selected={selected}
      onChange={setSelected}
      showPricing
      showCompare
    />
  )
}

export const Default: Story = {
  render: () => <Interactive />,
}

export const NoneSelected: Story = {
  args: {
    models: SAMPLE_MODELS,
    onChange: () => {},
    showPricing: true,
  },
}

export const WithCompare: Story = {
  args: {
    models: SAMPLE_MODELS,
    selected: 'gpt-4o',
    onChange: () => {},
    showPricing: true,
    showCompare: true,
  },
}
