import * as React from 'react'
import { cn } from '@/app/lib/utils'

export interface TitleLockupProps extends React.HTMLAttributes<HTMLElement> {}

const TitleLockup = React.forwardRef<HTMLElement, TitleLockupProps>(
  ({ className, ...props }, ref) => (
    <hgroup ref={ref} className={cn('text-center text-balance', className)} {...props} />
  )
)
TitleLockup.displayName = 'TitleLockup'

export { TitleLockup }
