import React, { ReactNode } from 'react';

interface FullWidthProps {
  children: ReactNode;
}

/**
 * A component that breaks out of its parent container to occupy the full width of the viewport.
 *
 * It uses the 'vw' units technique to expand beyond a constrained parent (like max-w-2xl).
 */
export default function FullWidth({ children }: FullWidthProps) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] max-w-[100vw] not-prose my-12">
      <div className="mx-auto w-full">{children}</div>
    </div>
  );
}
