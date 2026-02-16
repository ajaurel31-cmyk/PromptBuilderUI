import type { Meta, StoryObj } from '@storybook/react'
import { TokenBudgetBar } from './TokenBudgetBar'

const meta: Meta<typeof TokenBudgetBar> = {
  title: 'Starter/TokenBudgetBar',
  component: TokenBudgetBar,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 480, padding: 24, background: 'var(--surface-0)', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    systemTokens: { control: { type: 'range', min: 0, max: 16000, step: 100 } },
    userTokens: { control: { type: 'range', min: 0, max: 16000, step: 100 } },
    maxTokens: { control: { type: 'range', min: 1000, max: 128000, step: 1000 } },
    warningThreshold: { control: { type: 'range', min: 0.5, max: 1, step: 0.05 } },
  },
}

export default meta
type Story = StoryObj<typeof TokenBudgetBar>

export const Default: Story = {
  args: {
    systemTokens: 1200,
    userTokens: 800,
    maxTokens: 4096,
    warningThreshold: 0.85,
  },
}

export const HighUsage: Story = {
  args: {
    systemTokens: 2400,
    userTokens: 1800,
    maxTokens: 4096,
    warningThreshold: 0.85,
  },
}

export const Warning: Story = {
  args: {
    systemTokens: 2000,
    userTokens: 1600,
    maxTokens: 4096,
    warningThreshold: 0.85,
  },
}

export const OverBudget: Story = {
  args: {
    systemTokens: 3000,
    userTokens: 2000,
    maxTokens: 4096,
    warningThreshold: 0.85,
  },
}

export const LargeContext: Story = {
  args: {
    systemTokens: 8000,
    userTokens: 12000,
    maxTokens: 128000,
    warningThreshold: 0.85,
  },
}
