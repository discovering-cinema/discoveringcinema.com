'use client';

import { useEffect, useState } from 'react';
import { SectionLabel } from '@/app/components/SectionLabel';

interface Heading {
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <SectionLabel border className="mb-6">On this page</SectionLabel>
      <ul className="space-y-4">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={[
                'text-sm block pl-3 leading-snug transition-colors duration-200 border-l text-balance',
                activeId === id
                  ? 'text-primary font-medium border-primary/100'
                  : 'text-muted-foreground hover:text-foreground border-primary/0',
              ].join(' ')}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
