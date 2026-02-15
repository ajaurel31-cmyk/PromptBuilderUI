import { useState, useCallback, useEffect } from 'react'

export function usePromptStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage quota exceeded – silently ignore
    }
  }, [key, value])

  const clear = useCallback(() => {
    localStorage.removeItem(key)
    setValue(initial)
  }, [key, initial])

  return [value, setValue, clear] as const
}
