'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

type QAndAItem = {
  question: string;
  answer: string;
};

export default function QAndA({ items }: { items: QAndAItem[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(index: number, question: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        sendGAEvent('event', 'faq_expand', { question });
      }
      return next;
    });
  }

  return (
    <dl className="space-y-8">
      {items.map((item, index) => {
        const isOpen = expanded.has(index);
        return (
          <div key={index} className="border-t border-border pt-6">
            <dt>
              <button
                onClick={() => toggle(index, item.question)}
                className="flex w-full gap-3 items-baseline text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <p className="font-serif text-lg font-normal text-foreground flex-1">
                  {item.question}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </dt>
            <dd
              className={`m-0 overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
