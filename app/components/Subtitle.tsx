import * as React from 'react'
import { cn } from '@/app/lib/utils'

export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Subtitle = React.forwardRef<HTMLParagraphElement, SubtitleProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'font-montserrat text-[clamp(1rem,1.75vw,1.25rem)] font-normal leading-[1.6] tracking-[0.02em] text-muted-foreground mt-6 text-balance',
        className
      )}
      {...props}
    />
  )
)
Subtitle.displayName = 'Subtitle'

export { Subtitle }
