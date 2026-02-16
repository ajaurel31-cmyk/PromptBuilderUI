#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# package-tiers.sh
#
# Creates tier-specific zip files for Gumroad / Lemon Squeezy.
#
# Usage:  bash scripts/package-tiers.sh
# Output: releases/prompt-builder-ui-starter.zip
#         releases/prompt-builder-ui-pro.zip
# ───────────────────────────────────────────────────────────────

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/releases"
STAGING="$ROOT/.staging"

# ── Tier definitions ──────────────────────────────────────────

# Starter ($49): 6 core components
STARTER_COMPONENTS=(
  PromptComposer
  VariablePanel
  ParameterControls
  ConversationThread
  OutputPanel
  TokenBudgetBar
)

# Pro ($99): ALL 12 components + demo + storybook stories
PRO_COMPONENTS=(
  PromptComposer
  VariablePanel
  ParameterControls
  ConversationThread
  OutputPanel
  TokenBudgetBar
  PromptTemplateSelector
  SystemPromptEditor
  ModelSelector
  PromptChain
  PromptVersionHistory
  FewShotExampleManager
)

# ── Shared files included in every tier ───────────────────────

SHARED_FILES=(
  README.md
  LICENSE
  CHANGELOG.md
  package.json
  tsconfig.json
  tailwind.config.js
  postcss.config.js
  vite.config.ts
)

SHARED_DIRS=(
  src/hooks
  src/utils
  src/types
  src/themes
)

# ── Helpers ───────────────────────────────────────────────────

clean() {
  rm -rf "$STAGING" "$OUT"
  mkdir -p "$OUT"
}

copy_shared() {
  local dest="$1"
  mkdir -p "$dest"

  for f in "${SHARED_FILES[@]}"; do
    [ -f "$ROOT/$f" ] && cp "$ROOT/$f" "$dest/"
  done

  for d in "${SHARED_DIRS[@]}"; do
    [ -d "$ROOT/$d" ] && mkdir -p "$dest/$d" && cp -r "$ROOT/$d/." "$dest/$d/"
  done

  # Always include Icons
  mkdir -p "$dest/src/components"
  cp "$ROOT/src/components/Icons.tsx" "$dest/src/components/"
}

copy_components() {
  local dest="$1"
  shift
  local components=("$@")

  for comp in "${components[@]}"; do
    local src_dir="$ROOT/src/components/$comp"
    if [ -d "$src_dir" ]; then
      mkdir -p "$dest/src/components/$comp"
      cp -r "$src_dir/." "$dest/src/components/$comp/"
    fi
  done
}

generate_index() {
  local dest="$1"
  shift
  local components=("$@")
  local index_file="$dest/src/index.ts"

  cat > "$index_file" << 'HEADER'
/* ─── Components ─── */
HEADER

  for comp in "${components[@]}"; do
    case "$comp" in
      PromptComposer)
        cat >> "$index_file" << 'EOF'
export { PromptComposer } from './components/PromptComposer/PromptComposer'
export type { PromptComposerProps } from './components/PromptComposer/PromptComposer'
EOF
        ;;
      VariablePanel)
        cat >> "$index_file" << 'EOF'
export { VariablePanel } from './components/VariablePanel/VariablePanel'
export type { VariablePanelProps } from './components/VariablePanel/VariablePanel'
EOF
        ;;
      PromptTemplateSelector)
        cat >> "$index_file" << 'EOF'
export { PromptTemplateSelector } from './components/PromptTemplateSelector/PromptTemplateSelector'
export type { PromptTemplateSelectorProps } from './components/PromptTemplateSelector/PromptTemplateSelector'
EOF
        ;;
      SystemPromptEditor)
        cat >> "$index_file" << 'EOF'
export { SystemPromptEditor } from './components/SystemPromptEditor/SystemPromptEditor'
export type { SystemPromptEditorProps } from './components/SystemPromptEditor/SystemPromptEditor'
EOF
        ;;
      ModelSelector)
        cat >> "$index_file" << 'EOF'
export { ModelSelector } from './components/ModelSelector/ModelSelector'
export type { ModelSelectorProps } from './components/ModelSelector/ModelSelector'
EOF
        ;;
      ParameterControls)
        cat >> "$index_file" << 'EOF'
export { ParameterControls } from './components/ParameterControls/ParameterControls'
export type { ParameterControlsProps } from './components/ParameterControls/ParameterControls'
EOF
        ;;
      ConversationThread)
        cat >> "$index_file" << 'EOF'
export { ConversationThread } from './components/ConversationThread/ConversationThread'
export type { ConversationThreadProps } from './components/ConversationThread/ConversationThread'
export { MessageBubble } from './components/ConversationThread/MessageBubble'
export { StreamingText } from './components/ConversationThread/StreamingText'
EOF
        ;;
      PromptChain)
        cat >> "$index_file" << 'EOF'
export { PromptChain } from './components/PromptChain/PromptChain'
export type { PromptChainProps } from './components/PromptChain/PromptChain'
EOF
        ;;
      OutputPanel)
        cat >> "$index_file" << 'EOF'
export { OutputPanel } from './components/OutputPanel/OutputPanel'
export type { OutputPanelProps } from './components/OutputPanel/OutputPanel'
export { DiffView } from './components/OutputPanel/DiffView'
EOF
        ;;
      PromptVersionHistory)
        cat >> "$index_file" << 'EOF'
export { PromptVersionHistory } from './components/PromptVersionHistory/PromptVersionHistory'
export type { PromptVersionHistoryProps } from './components/PromptVersionHistory/PromptVersionHistory'
EOF
        ;;
      TokenBudgetBar)
        cat >> "$index_file" << 'EOF'
export { TokenBudgetBar } from './components/TokenBudgetBar/TokenBudgetBar'
export type { TokenBudgetBarProps } from './components/TokenBudgetBar/TokenBudgetBar'
EOF
        ;;
      FewShotExampleManager)
        cat >> "$index_file" << 'EOF'
export { FewShotExampleManager } from './components/FewShotExampleManager/FewShotExampleManager'
export type { FewShotExampleManagerProps } from './components/FewShotExampleManager/FewShotExampleManager'
EOF
        ;;
    esac
    echo "" >> "$index_file"
  done

  cat >> "$index_file" << 'FOOTER'
/* ─── Hooks ─── */
export { useTokenEstimate } from './hooks/useTokenEstimate'
export { useVariableParser } from './hooks/useVariableParser'
export { usePromptStorage } from './hooks/usePromptStorage'

/* ─── Utilities ─── */
export { estimateTokens, formatTokenCount, estimateCost } from './utils/token-counter'
export { extractVariables, replaceVariables, buildVariableDefinitions } from './utils/variable-parser'
export { computeDiff } from './utils/diff-engine'
export type { DiffLine } from './utils/diff-engine'
export { cn, formatDate, formatNumber, formatCurrency, truncate, generateId } from './utils/format-helpers'

/* ─── Icons ─── */
export * from './components/Icons'

/* ─── Types ─── */
export type {
  SlashCommand,
  Mention,
  PromptVariable,
  VariableValues,
  PromptTemplate,
  AIModel,
  ModelParameters,
  ParameterPreset,
  Message,
  ChainStepStatus,
  ChainStep,
  OutputFormat,
  OutputMetadata,
  PromptVersion,
  FewShotExample,
  SystemPromptSection,
} from './types'
FOOTER
}

build_tier() {
  local tier_name="$1"
  shift
  local components=("$@")

  echo "📦 Building $tier_name tier (${#components[@]} components)..."

  local dest="$STAGING/prompt-builder-ui"
  rm -rf "$STAGING"
  mkdir -p "$dest"

  copy_shared "$dest"
  copy_components "$dest" "${components[@]}"
  generate_index "$dest" "${components[@]}"

  # Pro tier includes demo + storybook config
  if [ "$tier_name" = "pro" ]; then
    [ -d "$ROOT/src/demo" ] && mkdir -p "$dest/src/demo" && cp -r "$ROOT/src/demo/." "$dest/src/demo/"
    [ -d "$ROOT/.storybook" ] && mkdir -p "$dest/.storybook" && cp -r "$ROOT/.storybook/." "$dest/.storybook/"

    # Include hook-specific files used by pro components
    for comp in "${components[@]}"; do
      case "$comp" in
        PromptComposer)
          # useSlashCommands and useTokenCount are inside the component folder already
          ;;
        VariablePanel)
          # useVariableDetection is inside the component folder already
          ;;
      esac
    done
  fi

  # Create zip
  (cd "$STAGING" && zip -qr "$OUT/prompt-builder-ui-${tier_name}.zip" prompt-builder-ui/)
  echo "   ✅ releases/prompt-builder-ui-${tier_name}.zip"
}

# ── Main ──────────────────────────────────────────────────────

echo ""
echo "🔨 Prompt Builder UI — Tier Packager"
echo "─────────────────────────────────────"

clean

build_tier "starter" "${STARTER_COMPONENTS[@]}"
build_tier "pro"     "${PRO_COMPONENTS[@]}"

rm -rf "$STAGING"

echo ""
echo "─────────────────────────────────────"
echo "✅ Done! Tier packages ready in releases/"
echo ""
ls -lh "$OUT"
echo ""
echo "Upload these to Gumroad / Lemon Squeezy:"
echo "  Starter (\$49)  → releases/prompt-builder-ui-starter.zip"
echo "  Pro     (\$99)  → releases/prompt-builder-ui-pro.zip"
echo ""
