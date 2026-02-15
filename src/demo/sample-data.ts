import type {
  AIModel,
  ChainStep,
  FewShotExample,
  Message,
  ModelParameters,
  PromptTemplate,
  PromptVariable,
  PromptVersion,
  SlashCommand,
  Mention,
} from '../types'

/* ─── Models ─── */
export const SAMPLE_MODELS: AIModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', contextWindow: 128000, pricePerInputToken: 0.0000025, pricePerOutputToken: 0.00001, speedRating: 4, recommended: true },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', contextWindow: 128000, pricePerInputToken: 0.00000015, pricePerOutputToken: 0.0000006, speedRating: 5 },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', contextWindow: 200000, pricePerInputToken: 0.000003, pricePerOutputToken: 0.000015, speedRating: 4, recommended: true },
  { id: 'claude-haiku-3.5', name: 'Claude 3.5 Haiku', provider: 'Anthropic', contextWindow: 200000, pricePerInputToken: 0.0000008, pricePerOutputToken: 0.000004, speedRating: 5 },
  { id: 'gemini-2-pro', name: 'Gemini 2.0 Pro', provider: 'Google', contextWindow: 2000000, pricePerInputToken: 0.00000125, pricePerOutputToken: 0.000005, speedRating: 4 },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta', contextWindow: 128000, speedRating: 4 },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', contextWindow: 128000, pricePerInputToken: 0.000002, pricePerOutputToken: 0.000006, speedRating: 3 },
]

/* ─── Parameters ─── */
export const DEFAULT_PARAMS: ModelParameters = {
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
}

/* ─── Templates ─── */
export const SAMPLE_TEMPLATES: PromptTemplate[] = [
  {
    id: '1', title: 'Code Review', description: 'Analyze code for bugs, performance issues, and best practices', category: 'Development',
    content: 'Review the following {{language}} code:\n\n```\n{{code}}\n```\n\nFocus on bugs, performance, and best practices.',
    tags: ['code', 'review'], starred: true,
  },
  {
    id: '2', title: 'API Documentation', description: 'Generate comprehensive API documentation', category: 'Development',
    content: 'Generate API documentation for:\n\n{{endpoints}}',
    tags: ['docs', 'api'],
  },
  {
    id: '3', title: 'Blog Post Writer', description: 'Write an engaging blog post on a given topic', category: 'Writing',
    content: 'Write a {{tone}} blog post about {{topic}}. Target: {{audience}}. Length: ~{{word_count}} words.',
    tags: ['blog', 'content'],
  },
  {
    id: '4', title: 'Email Drafter', description: 'Draft professional emails', category: 'Writing',
    content: 'Draft a {{tone}} email to {{recipient}} about {{subject}}.',
    tags: ['email'],
  },
  {
    id: '5', title: 'SQL Query Builder', description: 'Generate SQL from natural language', category: 'Development',
    content: 'Generate SQL for: {{description}}\n\nSchema:\n{{schema}}',
    tags: ['sql', 'database'], starred: true,
  },
  {
    id: '6', title: 'Data Analysis', description: 'Analyze data and provide insights', category: 'Analysis',
    content: 'Analyze this data:\n\n{{data}}\n\nFocus: {{focus_areas}}',
    tags: ['data', 'analytics'],
  },
]

/* ─── Slash Commands ─── */
export const SAMPLE_SLASH_COMMANDS: SlashCommand[] = [
  { id: 'translate', label: 'translate', description: 'Translate text', insert: 'Translate to {{language}}:\n\n' },
  { id: 'summarize', label: 'summarize', description: 'Summarize text', insert: 'Summarize the following:\n\n' },
  { id: 'code', label: 'code', description: 'Generate code', insert: 'Write a {{language}} function that ' },
  { id: 'explain', label: 'explain', description: 'Explain a concept', insert: 'Explain in simple terms:\n\n' },
]

/* ─── Mentions ─── */
export const SAMPLE_MENTIONS: Mention[] = [
  { id: 'readme', label: 'README.md', type: 'file' },
  { id: 'api', label: 'api/routes.ts', type: 'file' },
  { id: 'docs', label: 'docs.example.com', type: 'url' },
  { id: 'db', label: 'users_table', type: 'data' },
]

/* ─── Variables ─── */
export const SAMPLE_VARIABLES: PromptVariable[] = [
  { name: 'role', type: 'text', label: 'Role', description: 'AI expert role', defaultValue: 'software engineer' },
  { name: 'task', type: 'textarea', label: 'Task', description: 'What to help with', required: true },
  { name: 'language', type: 'select', label: 'Language', options: ['Python', 'TypeScript', 'Rust', 'Go'] },
  { name: 'include_examples', type: 'toggle', label: 'Include Examples', defaultValue: true },
]

/* ─── Messages ─── */
export const SAMPLE_MESSAGES: Message[] = [
  { id: '1', role: 'system', content: 'You are a senior TypeScript engineer.', tokens: 10 },
  { id: '2', role: 'user', content: 'How do I create a custom hook in React?', timestamp: new Date(Date.now() - 300000), tokens: 12 },
  {
    id: '3', role: 'assistant', tokens: 156, model: 'claude-sonnet-4',
    content: `Custom hooks start with **"use"** and can call other hooks:

\`\`\`typescript
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  return { count, increment: () => setCount(c => c + 1) }
}
\`\`\`

Use it: \`const { count, increment } = useCounter(0)\``,
    timestamp: new Date(Date.now() - 240000),
  },
]

/* ─── Chain Steps ─── */
export const SAMPLE_CHAIN_STEPS: ChainStep[] = [
  { id: '1', label: 'Extract Key Points', prompt: 'Extract main points from:\n\n{{input}}', outputVariable: 'key_points', status: 'complete', output: '1. AI transforms dev\n2. Components save time', tokens: 45 },
  { id: '2', label: 'Generate Summary', prompt: 'Summarize:\n\n{{key_points}}', outputVariable: 'summary', status: 'running', tokens: 32 },
  { id: '3', label: 'Create Tweets', prompt: 'Turn into tweet thread:\n\n{{summary}}', outputVariable: 'tweets', status: 'pending' },
]

/* ─── Versions ─── */
export const SAMPLE_VERSIONS: PromptVersion[] = [
  { id: 'v3', content: 'You are a senior TypeScript engineer. Review code for bugs, performance, and best practices.', timestamp: new Date(Date.now() - 60000), label: 'Added review focus', tag: 'latest', tokens: 24 },
  { id: 'v2', content: 'You are a TypeScript engineer. Help with code.', timestamp: new Date(Date.now() - 86400000), label: 'Simplified', tag: 'v1.0', tokens: 12 },
  { id: 'v1', content: 'You are a helpful assistant.', timestamp: new Date(Date.now() - 604800000), label: 'Initial', tag: 'initial', tokens: 8 },
]

/* ─── Few-Shot Examples ─── */
export const SAMPLE_FEW_SHOT: FewShotExample[] = [
  { id: '1', input: 'What is the capital of France?', output: 'The capital of France is Paris.', enabled: true, tokens: 18 },
  { id: '2', input: 'What is 2 + 2?', output: '2 + 2 = 4', enabled: true, tokens: 12 },
  { id: '3', input: 'Translate "hello" to Spanish.', output: '"Hello" in Spanish is "hola".', enabled: false, tokens: 14 },
]

/* ─── System Prompt ─── */
export const SAMPLE_SYSTEM_PROMPT = `## Role
You are a senior software engineer with expertise in TypeScript, React, and system design.

## Guidelines
- Always provide working code examples
- Explain your reasoning step by step
- Consider edge cases and error handling

## Output Format
- Use markdown formatting for code blocks
- Structure responses with clear headings
- Keep explanations concise but thorough`
