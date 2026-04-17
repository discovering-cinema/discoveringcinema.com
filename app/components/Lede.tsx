import * as React from 'react'
import { cn } from '@/app/lib/utils'

export interface LedeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Lede = React.forwardRef<HTMLDivElement, LedeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'font-lora italic text-[clamp(1.375rem,2.5vw,1.625rem)] font-normal leading-[1.65]',
        'text-foreground text-pretty text-balance',
        'first:mt-0 mt-10 mb-8 max-w-prose [&>p:first-child]:mt-0',
        className
      )}
      {...props}
    />
  )
)
Lede.displayName = 'Lede'

export { Lede }
