import type { Meta, StoryObj } from '@storybook/react'
import { OutputPanel } from './OutputPanel'

const SAMPLE_TEXT = `Here's a summary of the key differences between React and Vue:

1. **Component Architecture**: React uses JSX for templating while Vue uses HTML-based templates with directives.

2. **State Management**: React relies on hooks (\`useState\`, \`useReducer\`) while Vue uses reactive data properties.

3. **Learning Curve**: Vue is generally considered easier to learn for beginners due to its template syntax.

4. **Ecosystem**: React has a larger ecosystem with more third-party libraries and tools.

5. **Performance**: Both are highly performant, but Vue's reactivity system can be more efficient for fine-grained updates.`

const SAMPLE_JSON = JSON.stringify({
  model: 'claude-sonnet-4',
  tokens: { input: 245, output: 389 },
  response: { summary: 'Key differences between React and Vue frameworks', confidence: 0.95, topics: ['architecture', 'state', 'performance'] },
}, null, 2)

const meta: Meta<typeof OutputPanel> = {
  title: 'Components/OutputPanel',
  component: OutputPanel,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 600, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OutputPanel>

export const TextOutput: Story = {
  args: {
    output: SAMPLE_TEXT,
    format: 'text',
    metadata: { tokensUsed: 389, latencyMs: 2340, model: 'claude-sonnet-4', cost: 0.0058 },
    onRegenerate: () => alert('Regenerating...'),
  },
}

export const JSONOutput: Story = {
  args: {
    output: SAMPLE_JSON,
    format: 'json',
    metadata: { tokensUsed: 156, latencyMs: 1200, model: 'gpt-4o' },
  },
}

export const WithComparison: Story = {
  args: {
    output: SAMPLE_TEXT,
    format: 'text',
    compareWith: 'React and Vue are both popular JavaScript frameworks. React uses JSX while Vue uses templates.',
    metadata: { tokensUsed: 389, latencyMs: 2340, model: 'claude-sonnet-4' },
    onRegenerate: () => {},
  },
}
