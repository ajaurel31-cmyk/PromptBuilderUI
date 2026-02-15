import { useState, useCallback, useMemo } from 'react'
import type { SlashCommand } from '../../types'

export function useSlashCommands(commands: SlashCommand[]) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filtered = useMemo(() => {
    if (!query) return commands
    const q = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description?.toLowerCase().includes(q)
    )
  }, [commands, query])

  const open = useCallback((initialQuery = '') => {
    setQuery(initialQuery)
    setIsOpen(true)
    setSelectedIndex(0)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const moveSelection = useCallback(
    (direction: 'up' | 'down') => {
      setSelectedIndex((prev) => {
        if (direction === 'up') return prev > 0 ? prev - 1 : filtered.length - 1
        return prev < filtered.length - 1 ? prev + 1 : 0
      })
    },
    [filtered.length]
  )

  return {
    query,
    setQuery,
    isOpen,
    filtered,
    selectedIndex,
    open,
    close,
    moveSelection,
  }
}
