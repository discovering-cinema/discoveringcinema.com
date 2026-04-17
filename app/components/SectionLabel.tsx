import { cn } from '@/app/lib/utils'
import { ElementType, ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  as?: ElementType
  border?: boolean
  accent?: 'primary' | 'accent'
  className?: string
}

export function SectionLabel({
  children,
  as: Tag = 'h2',
  border = false,
  accent,
  className,
}: SectionLabelProps) {
  return (
    <Tag
      className={cn(
        'text-xs font-medium uppercase tracking-widest text-muted-foreground',
        accent && 'relative pl-3',
        border && 'border-b border-border pb-3',
        className,
      )}
    >
      {accent && (
        <span
          className={cn(
            'absolute inset-y-0 left-0 w-0.5 rounded-full',
            accent === 'primary' ? 'bg-primary' : 'bg-accent',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </Tag>
  )
}
