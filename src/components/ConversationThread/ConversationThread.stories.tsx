import type { Meta, StoryObj } from '@storybook/react'
import { ConversationThread } from './ConversationThread'
import type { Message } from '../../types'

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'system',
    content: 'You are a helpful assistant that specializes in TypeScript and React development.',
    tokens: 18,
  },
  {
    id: '2',
    role: 'user',
    content: 'How do I create a custom hook in React?',
    timestamp: new Date(Date.now() - 300000),
    tokens: 12,
  },
  {
    id: '3',
    role: 'assistant',
    content: `Custom hooks in React are functions that start with **"use"** and can call other hooks. Here's a simple example:

\`\`\`typescript
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}
\`\`\`

You can then use it in any component like \`const { count, increment } = useCounter(0)\`.

Key rules:
- Always prefix with \`use\`
- Only call hooks at the top level
- Only call hooks from React functions`,
    timestamp: new Date(Date.now() - 240000),
    tokens: 156,
    model: 'claude-sonnet-4',
  },
  {
    id: '4',
    role: 'user',
    content: 'Can you show me a more advanced example with TypeScript generics?',
    timestamp: new Date(Date.now() - 180000),
    tokens: 14,
  },
  {
    id: '5',
    role: 'assistant',
    content: `Here's a more advanced custom hook using TypeScript generics for local storage:

\`\`\`typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function
      ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}
\`\`\`

The generic \`T\` allows the hook to work with any type while maintaining **full type safety**.`,
    timestamp: new Date(Date.now() - 120000),
    tokens: 198,
    model: 'claude-sonnet-4',
  },
]

const meta: Meta<typeof ConversationThread> = {
  title: 'Components/ConversationThread',
  component: ConversationThread,
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
type Story = StoryObj<typeof ConversationThread>

export const Default: Story = {
  args: {
    messages: SAMPLE_MESSAGES,
    renderMarkdown: true,
  },
}

export const Streaming: Story = {
  args: {
    messages: [
      ...SAMPLE_MESSAGES.slice(0, 4),
      {
        id: '5',
        role: 'assistant' as const,
        content: 'Here is a more advanced example with TypeScript generics that demonstrates the power of custom hooks...',
        tokens: 24,
        model: 'claude-sonnet-4',
      },
    ],
    isStreaming: true,
    renderMarkdown: true,
  },
}

export const Empty: Story = {
  args: {
    messages: [],
    renderMarkdown: true,
  },
}
