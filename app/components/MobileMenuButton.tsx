'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full bg-background border-b border-border px-6 py-4 flex flex-col gap-4 z-50">
          <Link
            href="/journal"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Journal
          </Link>
          <Link
            href="/concepts"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Concepts
          </Link>
        </div>
      )}
    </div>
  );
}
