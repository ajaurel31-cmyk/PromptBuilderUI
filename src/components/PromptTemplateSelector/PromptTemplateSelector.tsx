import React, { useState, useMemo } from 'react'
import type { PromptTemplate } from '../../types'
import { cn, truncate } from '../../utils/format-helpers'
import { Search, Star, StarFilled, Grid, List, Eye } from '../Icons'

export interface PromptTemplateSelectorProps {
  templates: PromptTemplate[]
  categories?: string[]
  onSelect: (template: PromptTemplate) => void
  layout?: 'grid' | 'list'
  className?: string
}

export const PromptTemplateSelector: React.FC<PromptTemplateSelectorProps> = ({
  templates,
  categories: customCategories,
  onSelect,
  layout: initialLayout = 'grid',
  className,
}) => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [layout, setLayout] = useState(initialLayout)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [starred, setStarred] = useState<Set<string>>(
    new Set(templates.filter((t) => t.starred).map((t) => t.id))
  )

  const categories = customCategories || [
    ...new Set(templates.map((t) => t.category)),
  ]

  const filtered = useMemo(() => {
    let result = templates
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
    }
    // Sort starred first
    return [...result].sort((a, b) => {
      const aStarred = starred.has(a.id) ? 1 : 0
      const bStarred = starred.has(b.id) ? 1 : 0
      return bStarred - aStarred
    })
  }, [templates, activeCategory, search, starred])

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setStarred((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div
      className={cn('rounded-xl overflow-hidden', className)}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--prompt-border)',
      }}
    >
      {/* Header with search */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
            }}
          >
            <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates…"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--input-border)' }}>
            <button
              onClick={() => setLayout('grid')}
              className="p-2 transition-colors"
              style={{
                background: layout === 'grid' ? 'var(--selected-bg)' : 'transparent',
                color: layout === 'grid' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              }}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setLayout('list')}
              className="p-2 transition-colors"
              style={{
                background: layout === 'list' ? 'var(--selected-bg)' : 'transparent',
                color: layout === 'list' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              }}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 pb-scrollbar">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
            style={{
              background: !activeCategory ? 'var(--selected-bg)' : 'transparent',
              color: !activeCategory ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
              style={{
                background: activeCategory === cat ? 'var(--selected-bg)' : 'transparent',
                color: activeCategory === cat ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div
        className={cn(
          'p-4 pt-2 overflow-y-auto pb-scrollbar',
          layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'
        )}
        style={{ maxHeight: 420 }}
      >
        {filtered.length === 0 && (
          <div
            className="col-span-2 text-center py-8 text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            No templates found
          </div>
        )}
        {filtered.map((template) => (
          <div
            key={template.id}
            className={cn(
              'group relative rounded-xl p-4 cursor-pointer transition-all duration-150',
              layout === 'list' && 'flex items-start gap-4'
            )}
            style={{
              background: 'var(--surface-2)',
              border: `1px solid ${hoveredId === template.id ? 'var(--accent-primary)' : 'var(--prompt-border)'}`,
            }}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect(template)}
          >
            {/* Star button */}
            <button
              onClick={(e) => toggleStar(e, template.id)}
              className="absolute top-3 right-3 transition-colors"
              style={{
                color: starred.has(template.id) ? 'var(--status-warning)' : 'var(--text-tertiary)',
              }}
            >
              {starred.has(template.id) ? <StarFilled size={14} /> : <Star size={14} />}
            </button>

            <div className={cn(layout === 'list' && 'flex-1 min-w-0')}>
              {/* Category badge */}
              <span
                className="inline-block text-[10px] px-1.5 py-0.5 rounded-md font-medium mb-2"
                style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
              >
                {template.category}
              </span>

              {/* Title */}
              <h4
                className="text-sm font-semibold mb-1 pr-6"
                style={{ color: 'var(--text-primary)' }}
              >
                {template.title}
              </h4>

              {/* Description */}
              <p
                className="text-xs leading-relaxed mb-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {truncate(template.description, layout === 'grid' ? 80 : 160)}
              </p>

              {/* Tags */}
              {template.tags && (
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--surface-3)', color: 'var(--text-tertiary)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preview tooltip on hover */}
            {hoveredId === template.id && (
              <div
                className="absolute bottom-full left-0 right-0 mb-2 p-3 rounded-lg text-xs z-10"
                style={{
                  background: 'var(--dropdown-bg)',
                  border: '1px solid var(--prompt-border)',
                  boxShadow: 'var(--dropdown-shadow)',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  maxHeight: 160,
                  overflow: 'hidden',
                }}
              >
                <div className="flex items-center gap-1 mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  <Eye size={10} />
                  <span className="text-[10px] font-medium">Preview</span>
                </div>
                <div className="font-mono text-[11px]">{truncate(template.content, 300)}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
