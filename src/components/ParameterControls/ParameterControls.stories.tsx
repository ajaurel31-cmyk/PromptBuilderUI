import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ParameterControls } from './ParameterControls'
import type { ModelParameters } from '../../types'

const meta: Meta<typeof ParameterControls> = {
  title: 'Components/ParameterControls',
  component: ParameterControls,
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
type Story = StoryObj<typeof ParameterControls>

const DEFAULT_PARAMS: ModelParameters = {
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
}

const Interactive = () => {
  const [values, setValues] = useState<ModelParameters>(DEFAULT_PARAMS)
  return <ParameterControls values={values} onChange={setValues} />
}

export const Default: Story = {
  render: () => <Interactive />,
}

export const WithAdvanced: Story = {
  args: {
    values: DEFAULT_PARAMS,
    onChange: () => {},
    showAdvanced: true,
  },
}

export const CreativeSettings: Story = {
  args: {
    values: {
      temperature: 1.3,
      maxTokens: 8192,
      topP: 1,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
    },
    onChange: () => {},
    showAdvanced: true,
  },
}
