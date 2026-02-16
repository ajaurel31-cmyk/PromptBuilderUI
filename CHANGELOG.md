# Changelog

All notable changes to Prompt Builder UI will be documented in this file.

## [1.0.0] - 2026-02-15

### Added

- **12 production-ready components:**
  - PromptComposer — auto-expanding textarea with variable highlighting, slash commands, @-mentions, token counting
  - VariablePanel — auto-detects `{{variables}}`, typed inputs (text, textarea, number, select, toggle), live preview
  - PromptTemplateSelector — searchable grid/list picker with categories, favorites, hover preview
  - SystemPromptEditor — editor + sections mode with drag-reorder, collapsible blocks, per-section token counts
  - ModelSelector — grouped dropdown with provider colors, pricing, speed ratings, compare mode
  - ParameterControls — temperature/topP/maxTokens sliders with labeled zones and presets
  - ConversationThread — chat bubbles with markdown/code rendering, streaming typewriter, copy per message
  - PromptChain — visual pipeline builder with drag-reorder, status indicators, output variable mapping
  - OutputPanel — tabbed text/JSON/markdown/diff views, copy, regenerate, side-by-side comparison
  - PromptVersionHistory — timeline with diff viewer, compare mode, restore, tags/labels
  - TokenBudgetBar — segmented bar (system/user/response) with warning states
  - FewShotExampleManager — input/output pairs, drag-reorder, toggle enable/disable, auto-format

- **Theming system** with CSS variables, light + dark built-in themes
- **30+ custom SVG icons** (zero icon library dependencies)
- **3 custom hooks:** useTokenEstimate, useVariableParser, usePromptStorage
- **Utility functions:** token counting, variable parsing, diff engine, formatting helpers
- **Full TypeScript type definitions** for all components and data structures
- **Storybook stories** for every component with interactive controls
- **Full Workbench demo** combining all components into a complete prompt engineering interface
- **Barrel export** (`src/index.ts`) for clean imports
