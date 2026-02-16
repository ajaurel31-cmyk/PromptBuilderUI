# Prompt Builder UI

A polished, copy-paste React component library for developers building AI-powered apps that need prompt construction interfaces. 12 production-ready components with full TypeScript support, Tailwind CSS theming, and Storybook documentation.

---

## Pricing Tiers

### Starter — $49

6 core components to get you building right away.

| # | Component | Description |
|---|-----------|-------------|
| 1 | **PromptComposer** | Auto-expanding textarea with variable highlighting, slash commands, @-mentions, token counting, Cmd+Enter submit |
| 2 | **VariablePanel** | Auto-detects `{{variables}}` from prompt text, renders typed inputs (text, textarea, number, select, toggle), live preview |
| 3 | **ParameterControls** | Temperature/TopP/MaxTokens sliders with labeled zones, presets (Precise/Balanced/Creative/Code) |
| 4 | **ConversationThread** | Chat bubbles with markdown/code rendering, streaming typewriter effect, copy per message |
| 5 | **OutputPanel** | Tabbed text/JSON/markdown/diff views, copy, regenerate, side-by-side comparison |
| 6 | **TokenBudgetBar** | Segmented bar (system/user/response) with warning states and color-coded legend |

Includes: 30+ custom SVG icons, 3 hooks, utility functions, and full type definitions.

### Pro — $99

Everything in Starter, plus 6 advanced components, the demo workbench, and Storybook stories.

| # | Component | Description |
|---|-----------|-------------|
| 7 | **PromptTemplateSelector** | Searchable grid/list template picker with categories, favorites, hover preview |
| 8 | **SystemPromptEditor** | Editor + sections mode with drag-reorder, collapsible blocks, per-section token counts |
| 9 | **ModelSelector** | Grouped dropdown with provider colors, pricing, speed ratings, side-by-side compare mode |
| 10 | **PromptChain** | Visual pipeline builder with drag-reorder, status indicators, output variable mapping |
| 11 | **PromptVersionHistory** | Timeline with diff viewer, compare mode, restore, tags/labels |
| 12 | **FewShotExampleManager** | Input/output pairs, drag-reorder, toggle enable/disable, token counts, auto-format |

Pro also includes: Full Workbench demo app, Storybook configuration, and all component stories.

---

## Quick Start

### 1. Install dependencies

```bash
npm install react react-dom tailwindcss
```

### 2. Copy the `src/` folder into your project

This is a source code library — copy the files you need directly into your project.

```
your-project/
  src/
    components/     # Copy from src/components/
    hooks/          # Copy from src/hooks/
    utils/          # Copy from src/utils/
    types/          # Copy from src/types/
    themes/         # Copy from src/themes/
```

### 3. Import the theme CSS

Add the theme CSS files to your app's entry point:

```tsx
import './themes/variables.css'
import './themes/light.css'
import './themes/dark.css'
```

### 4. Add Tailwind content paths

In your `tailwind.config.js`, make sure the content array includes the component paths:

```js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}
```

### 5. Use components

```tsx
import { PromptComposer } from './components/PromptComposer/PromptComposer'
// or if using the barrel export:
import { PromptComposer, VariablePanel, TokenBudgetBar } from './index'

function App() {
  const [prompt, setPrompt] = useState('')

  return (
    <PromptComposer
      value={prompt}
      onChange={setPrompt}
      onSubmit={(val) => console.log('Submitted:', val)}
      maxTokens={4096}
      placeholder="Write your prompt here..."
    />
  )
}
```

---

## Component Usage

### PromptComposer

The main textarea with slash commands, @-mentions, and variable highlighting.

```tsx
import { PromptComposer } from './components/PromptComposer/PromptComposer'

<PromptComposer
  value={prompt}
  onChange={setPrompt}
  onSubmit={(val) => handleSubmit(val)}
  maxTokens={4096}
  variables={['role', 'task']}
  slashCommands={[
    { id: 'summarize', label: 'summarize', description: 'Summarize text', insert: 'Summarize:\n\n' },
  ]}
  mentions={[
    { id: 'readme', label: 'README.md', type: 'file' },
  ]}
  placeholder="Type / for commands, @ for mentions..."
/>
```

**Props:** `value`, `onChange`, `onSubmit`, `maxTokens`, `variables`, `slashCommands`, `mentions`, `placeholder`, `className`

### VariablePanel

Auto-detects `{{variables}}` and renders typed input fields with live preview.

```tsx
import { VariablePanel } from './components/VariablePanel/VariablePanel'

<VariablePanel
  variables={[
    { name: 'role', type: 'text', label: 'Role', description: 'Expert role' },
    { name: 'language', type: 'select', label: 'Language', options: ['Python', 'TypeScript'] },
    { name: 'verbose', type: 'toggle', label: 'Verbose', defaultValue: false },
  ]}
  values={variableValues}
  onChange={setVariableValues}
  promptText="You are a {{role}} expert. Write {{language}} code."
  layout="panel"
/>
```

**Props:** `variables`, `values`, `onChange`, `promptText`, `layout` (`"inline"` | `"panel"`), `className`

### ModelSelector

Dropdown selector grouped by provider with pricing, speed ratings, and compare mode.

```tsx
import { ModelSelector } from './components/ModelSelector/ModelSelector'

<ModelSelector
  models={[
    { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', contextWindow: 200000, pricePerInputToken: 0.000003, speedRating: 4, recommended: true },
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', contextWindow: 128000, pricePerInputToken: 0.0000025, speedRating: 4 },
  ]}
  selected={selectedModel}
  onChange={setSelectedModel}
  showPricing
  showCompare
/>
```

**Props:** `models`, `selected`, `onChange`, `showPricing`, `showCompare`, `className`

### ParameterControls

Sliders for temperature, max tokens, top-p with presets and collapsible advanced section.

```tsx
import { ParameterControls } from './components/ParameterControls/ParameterControls'

<ParameterControls
  values={{ temperature: 0.7, maxTokens: 4096, topP: 1, frequencyPenalty: 0, presencePenalty: 0 }}
  onChange={setParams}
  showAdvanced={false}
/>
```

**Props:** `values`, `onChange`, `presets`, `showAdvanced`, `className`

### ConversationThread

Chat-style message display with markdown rendering, code highlighting, and streaming animation.

```tsx
import { ConversationThread } from './components/ConversationThread/ConversationThread'

<ConversationThread
  messages={[
    { id: '1', role: 'system', content: 'You are a helpful assistant.' },
    { id: '2', role: 'user', content: 'Hello!' },
    { id: '3', role: 'assistant', content: 'Hi! How can I help?' },
  ]}
  isStreaming={false}
  renderMarkdown
/>
```

**Props:** `messages`, `onCopy`, `isStreaming`, `renderMarkdown`, `className`

### TokenBudgetBar

Visual token budget with color-coded segments and warning states.

```tsx
import { TokenBudgetBar } from './components/TokenBudgetBar/TokenBudgetBar'

<TokenBudgetBar
  systemTokens={1200}
  userTokens={800}
  maxTokens={4096}
  warningThreshold={0.85}
/>
```

**Props:** `systemTokens`, `userTokens`, `maxTokens`, `warningThreshold`, `className`

### PromptTemplateSelector

Searchable template picker with grid/list views, categories, and favorites.

```tsx
import { PromptTemplateSelector } from './components/PromptTemplateSelector/PromptTemplateSelector'

<PromptTemplateSelector
  templates={templates}
  onSelect={(template) => setPrompt(template.content)}
  layout="grid"
/>
```

**Props:** `templates`, `categories`, `onSelect`, `layout` (`"grid"` | `"list"`), `className`

### SystemPromptEditor

Editor with sections mode for organizing system prompts into draggable blocks.

```tsx
import { SystemPromptEditor } from './components/SystemPromptEditor/SystemPromptEditor'

<SystemPromptEditor
  value={systemPrompt}
  onChange={setSystemPrompt}
  maxTokens={2000}
/>
```

**Props:** `value`, `onChange`, `sections`, `onSectionsChange`, `maxTokens`, `className`

### PromptChain

Visual pipeline builder for multi-step prompt workflows.

```tsx
import { PromptChain } from './components/PromptChain/PromptChain'

<PromptChain
  steps={steps}
  onStepChange={setSteps}
  onRun={(stepId) => runStep(stepId)}
  layout="vertical"
/>
```

**Props:** `steps`, `onStepChange`, `onRun`, `layout` (`"vertical"` | `"horizontal"`), `className`

### OutputPanel

Tabbed output display with JSON formatting, diff view, and side-by-side comparison.

```tsx
import { OutputPanel } from './components/OutputPanel/OutputPanel'

<OutputPanel
  output={responseText}
  format="text"
  metadata={{ tokensUsed: 389, latencyMs: 2340, model: 'claude-sonnet-4', cost: 0.0058 }}
  onRegenerate={() => regenerate()}
  compareWith={previousOutput}
/>
```

**Props:** `output`, `format` (`"text"` | `"json"` | `"markdown"` | `"diff"`), `metadata`, `onRegenerate`, `compareWith`, `className`

### PromptVersionHistory

Version timeline with diff viewer, compare mode, and restore.

```tsx
import { PromptVersionHistory } from './components/PromptVersionHistory/PromptVersionHistory'

<PromptVersionHistory
  versions={versions}
  currentVersion="v3"
  onRestore={(version) => setPrompt(version.content)}
  onCompare={(a, b) => showDiff(a, b)}
/>
```

**Props:** `versions`, `currentVersion`, `onRestore`, `onCompare`, `className`

### FewShotExampleManager

Manage few-shot examples with drag-reorder, enable/disable, and auto-format.

```tsx
import { FewShotExampleManager } from './components/FewShotExampleManager/FewShotExampleManager'

<FewShotExampleManager
  examples={examples}
  onChange={setExamples}
  maxExamples={10}
  format="chat"
/>
```

**Props:** `examples`, `onChange`, `maxExamples`, `format` (`"chat"` | `"completion"`), `className`

---

## Theming

All components use CSS variables for theming. Two themes are included: **light** and **dark**.

### Switching themes

Add the `light` or `dark` class to a parent element:

```html
<div class="light"><!-- Light theme --></div>
<div class="dark"><!-- Dark theme --></div>
```

### Customizing colors

Override any CSS variable in your own stylesheet:

```css
:root {
  --accent-primary: #e11d48;     /* Your brand color */
  --accent-secondary: #f43f5e;
  --radius: 12px;                /* Rounder corners */
  --surface-0: #fafafa;          /* Slightly off-white background */
}
```

### Available CSS variables

**Surfaces:** `--surface-0` through `--surface-3`
**Text:** `--text-primary`, `--text-secondary`, `--text-tertiary`
**Prompt:** `--prompt-bg`, `--prompt-border`, `--prompt-text`
**Accent:** `--accent-primary`, `--accent-secondary`
**Status:** `--status-success`, `--status-error`, `--status-warning`
**Tokens:** `--token-system`, `--token-user`, `--token-response`
**UI:** `--input-bg`, `--input-border`, `--hover-bg`, `--selected-bg`, `--badge-bg`, `--badge-text`, `--code-bg`, `--divider`, `--dropdown-bg`
**Chat bubbles:** `--bubble-user`, `--bubble-user-text`, `--bubble-assistant`, `--bubble-assistant-text`
**Controls:** `--slider-track`, `--slider-fill`, `--slider-thumb`
**Layout:** `--radius-sm`, `--radius`, `--radius-lg`, `--radius-xl`, `--shadow-sm`, `--shadow`, `--shadow-lg`

---

## Running Storybook

View all components interactively with Storybook:

```bash
npm install
npm run storybook
```

This opens Storybook at `http://localhost:6006` with:
- Individual component stories with controls
- Light and dark theme switching
- Full Workbench demo combining all components

---

## File Structure

```
src/
  components/
    PromptComposer/          # Main prompt textarea
    VariablePanel/            # Template variable inputs
    PromptTemplateSelector/   # Template picker
    SystemPromptEditor/       # System prompt with sections
    ModelSelector/            # AI model dropdown
    ParameterControls/        # Sliders for temperature, etc.
    ConversationThread/       # Chat message display
    PromptChain/              # Multi-step pipeline builder
    OutputPanel/              # Response display with tabs
    PromptVersionHistory/     # Version timeline with diff
    TokenBudgetBar/           # Token usage visualization
    FewShotExampleManager/    # Few-shot example pairs
    Icons.tsx                 # 30+ custom SVG icons
  hooks/
    useTokenEstimate.ts       # Token counting hook
    useVariableParser.ts      # Variable extraction hook
    usePromptStorage.ts       # LocalStorage persistence hook
  utils/
    token-counter.ts          # Token estimation (word/4 heuristic)
    variable-parser.ts        # {{variable}} extraction & replacement
    diff-engine.ts            # Line-based text diff
    format-helpers.ts         # cn(), formatDate(), truncate(), etc.
  types/
    index.ts                  # All TypeScript interfaces
  themes/
    variables.css             # Shared layout tokens
    light.css                 # Light theme colors
    dark.css                  # Dark theme colors
  demo/
    FullWorkbench.tsx          # All components wired together
    sample-data.ts             # Example templates, models, etc.
  index.ts                    # Barrel export (all components, hooks, utils, types)
```

---

## Tech Stack

- **React 18+** / Next.js 14 compatible
- **TypeScript** with strict mode
- **Tailwind CSS** + CSS variables for theming
- **Zero external dependencies** beyond React + Tailwind
- **Storybook 8** for documentation and demos

---

## License

MIT License. See [LICENSE](./LICENSE) for details.
