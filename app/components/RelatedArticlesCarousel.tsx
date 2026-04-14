'use client';

import { useState } from 'react';
import ArticlePreview from '@/app/components/ArticlePreview';
import type { Post } from '@/app/lib/posts';

interface RelatedArticlesCarouselProps {
  related: Post[];
}

export default function RelatedArticlesCarousel({
  related,
}: RelatedArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === related.length - 1;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setCurrentIndex((i) => Math.min(related.length - 1, i + 1));

  const current = related[currentIndex];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Related reading
        </h2>
        {related.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {currentIndex + 1} / {related.length}
            </span>
            <button
              onClick={prev}
              aria-label="Previous article"
              disabled={isFirst}
              className={`flex items-center justify-center w-5 h-5 border border-border transition-colors ${
                isFirst
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-foreground/40 hover:text-primary cursor-pointer'
              }`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7.5 2L3.5 6L7.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next article"
              disabled={isLast}
              className={`flex items-center justify-center w-5 h-5 border border-border transition-colors ${
                isLast
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-foreground/40 hover:text-primary cursor-pointer'
              }`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4.5 2L8.5 6L4.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div aria-live="polite">
        <div key={currentIndex} className="animate-fade-in">
          <ArticlePreview
            title={current.title}
            slug={current.slug}
            date={current.date}
            description={current.description}
            image={current.image}
            series={current.series}
            seriesSlug={current.seriesSlug}
          />
        </div>
      </div>
    </div>
  );
}
