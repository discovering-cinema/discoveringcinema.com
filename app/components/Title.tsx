import * as React from 'react'
import { cn } from '@/app/lib/utils'

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'font-playfair text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight tracking-tight text-center text-balance',
        className
      )}
      {...props}
    />
  )
)
Title.displayName = 'Title'

export { Title }
