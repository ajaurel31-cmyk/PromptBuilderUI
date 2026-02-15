import React, { useState, useEffect } from 'react'

interface StreamingTextProps {
  text: string
  speed?: number
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  speed = 20,
}) => {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setDisplayed('')
    setIndex(0)
  }, [text])

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        // Add a few characters at a time for more natural feel
        const chunkSize = Math.floor(Math.random() * 3) + 1
        setDisplayed(text.slice(0, index + chunkSize))
        setIndex((prev) => prev + chunkSize)
      }, speed + Math.random() * speed)
      return () => clearTimeout(timer)
    }
  }, [index, text, speed])

  return (
    <span>
      {displayed}
      {index < text.length && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
          style={{ background: 'var(--accent-primary)', verticalAlign: 'text-bottom' }}
        />
      )}
    </span>
  )
}
