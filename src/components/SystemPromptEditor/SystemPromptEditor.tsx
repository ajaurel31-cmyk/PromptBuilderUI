import React, { useState, useMemo } from 'react'
import type { SystemPromptSection } from '../../types'
import { cn } from '../../utils/format-helpers'
import { estimateTokens, formatTokenCount } from '../../utils/token-counter'
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash } from '../Icons'

export interface SystemPromptEditorProps {
  value: string
  onChange: (value: string) => void
  sections?: SystemPromptSection[]
  onSectionsChange?: (sections: SystemPromptSection[]) => void
  maxTokens?: number
  className?: string
}

export const SystemPromptEditor: React.FC<SystemPromptEditorProps> = ({
  value,
  onChange,
  sections: controlledSections,
  onSectionsChange,
  maxTokens,
  className,
}) => {
  const [mode, setMode] = useState<'editor' | 'sections'>('editor')
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const parsedSections = useMemo(() => {
    if (controlledSections) return controlledSections
    return parseSections(value)
  }, [controlledSections, value])

  const totalTokens = estimateTokens(value)

  const handleSectionToggle = (id: string) => {
    const updated = parsedSections.map((s) =>
      s.id === id ? { ...s, collapsed: !s.collapsed } : s
    )
    onSectionsChange?.(updated)
  }

  const handleSectionEdit = (id: string, content: string) => {
    const updated = parsedSections.map((s) =>
      s.id === id ? { ...s, content, tokens: estimateTokens(content) } : s
    )
    onSectionsChange?.(updated)
    onChange(sectionsToText(updated))
  }

  const handleSectionDelete = (id: string) => {
    const updated = parsedSections.filter((s) => s.id !== id)
    onSectionsChange?.(updated)
    onChange(sectionsToText(updated))
  }

  const handleAddSection = () => {
    const newSection: SystemPromptSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: '',
      collapsed: false,
      tokens: 0,
    }
    const updated = [...parsedSections, newSection]
    onSectionsChange?.(updated)
    onChange(sectionsToText(updated))
  }

  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...parsedSections]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    onSectionsChange?.(updated)
    onChange(sectionsToText(updated))
    setDragIndex(index)
  }
  const handleDragEnd = () => setDragIndex(null)

  return (
    <div
      className={cn('rounded-xl overflow-hidden', className)}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--prompt-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--divider)' }}
      >
        <div className="flex items-center gap-2">
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            System Prompt
          </h3>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
            style={{
              background: totalTokens > (maxTokens || Infinity) ? 'rgba(239,68,68,0.1)' : 'var(--badge-bg)',
              color: totalTokens > (maxTokens || Infinity) ? 'var(--status-error)' : 'var(--badge-text)',
            }}
          >
            {formatTokenCount(totalTokens)} tokens
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: '1px solid var(--input-border)' }}>
          <button
            onClick={() => setMode('editor')}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: mode === 'editor' ? 'var(--selected-bg)' : 'transparent',
              color: mode === 'editor' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}
          >
            Editor
          </button>
          <button
            onClick={() => setMode('sections')}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: mode === 'sections' ? 'var(--selected-bg)' : 'transparent',
              color: mode === 'sections' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}
          >
            Sections
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'editor' ? (
        <div className="p-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={12}
            className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none font-mono p-3 rounded-lg"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              border: '1px solid var(--input-border)',
              caretColor: 'var(--accent-primary)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
          />
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {parsedSections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="rounded-lg overflow-hidden transition-all duration-150"
              style={{
                background: 'var(--surface-2)',
                border: `1px solid ${dragIndex === index ? 'var(--accent-primary)' : 'var(--prompt-border)'}`,
                opacity: dragIndex === index ? 0.6 : 1,
              }}
            >
              {/* Section header */}
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                onClick={() => handleSectionToggle(section.id)}
              >
                <GripVertical
                  size={14}
                  className="cursor-grab flex-shrink-0"
                  style={{ color: 'var(--text-tertiary)' }}
                />
                <span style={{ color: 'var(--text-tertiary)' }}>
                  {section.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </span>
                <span
                  className="flex-1 text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.title}
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {formatTokenCount(section.tokens || estimateTokens(section.content))}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSectionDelete(section.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                  style={{ color: 'var(--status-error)' }}
                >
                  <Trash size={12} />
                </button>
              </div>

              {/* Section content */}
              {!section.collapsed && (
                <div className="px-3 pb-3">
                  <textarea
                    value={section.content}
                    onChange={(e) => handleSectionEdit(section.id, e.target.value)}
                    rows={4}
                    className="w-full resize-none text-xs font-mono leading-relaxed outline-none p-2 rounded"
                    style={{
                      background: 'var(--surface-0)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--input-border)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--input-border)')}
                  />
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleAddSection}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              border: '1px dashed var(--prompt-border)',
              color: 'var(--text-tertiary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--prompt-border)'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <Plus size={12} />
            Add Section
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Helpers ─── */
function parseSections(text: string): SystemPromptSection[] {
  const lines = text.split('\n')
  const sections: SystemPromptSection[] = []
  let currentSection: SystemPromptSection | null = null

  for (const line of lines) {
    const headerMatch = line.match(/^##?\s+(.+)/)
    if (headerMatch) {
      if (currentSection) sections.push(currentSection)
      currentSection = {
        id: `section-${sections.length}`,
        title: headerMatch[1].trim(),
        content: '',
        collapsed: false,
      }
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? '\n' : '') + line
    } else {
      // Text before any header
      if (!currentSection) {
        currentSection = {
          id: 'section-intro',
          title: 'Introduction',
          content: line,
          collapsed: false,
        }
      }
    }
  }
  if (currentSection) sections.push(currentSection)

  return sections.map((s) => ({
    ...s,
    content: s.content.trim(),
    tokens: estimateTokens(s.content),
  }))
}

function sectionsToText(sections: SystemPromptSection[]): string {
  return sections
    .map((s) => `## ${s.title}\n${s.content}`)
    .join('\n\n')
}
