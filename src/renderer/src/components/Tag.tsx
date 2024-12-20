import React from 'react'
import { cn } from '../lib/utils'

interface TagProps {
  name: string
  className?: string
}

export function Tag({ name, className }: TagProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
        className
      )}
    >
      {name}
    </span>
  )
}
