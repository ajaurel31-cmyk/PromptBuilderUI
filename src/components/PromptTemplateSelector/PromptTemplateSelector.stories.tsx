import type { Meta, StoryObj } from '@storybook/react'
import { PromptTemplateSelector } from './PromptTemplateSelector'
import type { PromptTemplate } from '../../types'

const SAMPLE_TEMPLATES: PromptTemplate[] = [
  {
    id: '1', title: 'Code Review', description: 'Analyze code for bugs, performance issues, and best practices', category: 'Development',
    content: 'Review the following {{language}} code for bugs, performance issues, and adherence to best practices:\n\n```\n{{code}}\n```',
    tags: ['code', 'review'], starred: true,
  },
  {
    id: '2', title: 'API Documentation', description: 'Generate comprehensive API documentation from code', category: 'Development',
    content: 'Generate API documentation for the following endpoints:\n\n{{endpoints}}',
    tags: ['docs', 'api'],
  },
  {
    id: '3', title: 'Blog Post Writer', description: 'Write an engaging blog post on a given topic', category: 'Writing',
    content: 'Write a {{tone}} blog post about {{topic}}. Target audience: {{audience}}. Length: approximately {{word_count}} words.',
    tags: ['blog', 'writing'],
  },
  {
    id: '4', title: 'Email Drafter', description: 'Draft professional emails with the right tone', category: 'Writing',
    content: 'Draft a {{tone}} email to {{recipient}} about {{subject}}.\n\nKey points to cover:\n{{key_points}}',
    tags: ['email', 'professional'],
  },
  {
    id: '5', title: 'Data Analysis', description: 'Analyze datasets and extract insights', category: 'Analysis',
    content: 'Analyze the following data and provide key insights:\n\n{{data}}\n\nFocus on: {{focus_areas}}',
    tags: ['data', 'analytics'],
  },
  {
    id: '6', title: 'SQL Query Builder', description: 'Generate SQL queries from natural language', category: 'Development',
    content: 'Generate a SQL query for: {{description}}\n\nTable schema:\n{{schema}}',
    tags: ['sql', 'database'], starred: true,
  },
  {
    id: '7', title: 'Meeting Summary', description: 'Summarize meeting notes into actionable items', category: 'Productivity',
    content: 'Summarize these meeting notes into key decisions and action items:\n\n{{notes}}',
    tags: ['meetings', 'summary'],
  },
  {
    id: '8', title: 'Product Description', description: 'Write compelling product descriptions for e-commerce', category: 'Marketing',
    content: 'Write a compelling product description for {{product_name}}.\n\nFeatures: {{features}}\nTarget audience: {{audience}}\nTone: {{tone}}',
    tags: ['product', 'ecommerce'],
  },
]

const meta: Meta<typeof PromptTemplateSelector> = {
  title: 'Pro/PromptTemplateSelector',
  component: PromptTemplateSelector,
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
type Story = StoryObj<typeof PromptTemplateSelector>

export const GridView: Story = {
  args: {
    templates: SAMPLE_TEMPLATES,
    onSelect: (t) => alert(`Selected: ${t.title}`),
    layout: 'grid',
  },
}

export const ListView: Story = {
  args: {
    templates: SAMPLE_TEMPLATES,
    onSelect: (t) => alert(`Selected: ${t.title}`),
    layout: 'list',
  },
}
