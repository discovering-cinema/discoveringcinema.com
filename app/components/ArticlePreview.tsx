import Link from 'next/link';
import Image from 'next/image';
import SeriesLabel from '@/app/components/SeriesLabel';
import ArticleSummary from '@/app/components/ArticleSummary';
import ArticleDate from '@/app/components/ArticleDate';

interface ArticlePreviewProps {
  title: string;
  slug: string;
  date?: Date | string | null;
  description?: string;
  image?: string;
  series?: string;
  seriesSlug?: string;
  order?: number;
  variant?: 'default' | 'compact';
  priority?: boolean;
}

export default function ArticlePreview({
  title,
  slug,
  date,
  description,
  image,
  series,
  seriesSlug,
  order,
  variant = 'default',
  priority = false,
}: ArticlePreviewProps) {
  const isCompact = variant === 'compact';

  return (
    <article className="group relative flex flex-col items-start">
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-muted aspect-video ${isCompact ? 'mb-4' : 'mb-6'}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes={
              isCompact
                ? '(max-width: 640px) calc(100vw - 48px), (max-width: 672px) calc(50vw - 36px), 312px'
                : '(max-width: 672px) calc(100vw - 48px), 672px'
            }
            className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="font-serif italic">Discovering Cinema</span>
          </div>
        )}
      </div>

      {order && (
        <small className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-block">
          Part {order}
        </small>
      )}

      {series && seriesSlug && <SeriesLabel series={series} seriesSlug={seriesSlug} />}

      <h2
        className={`font-serif font-normal tracking-tight text-foreground ${isCompact ? 'text-lg' : 'text-2xl'}`}
      >
        <Link href={`/journal/${slug}`}>
          <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          <span className="relative z-10">{title}</span>
        </Link>
      </h2>

      {description && <ArticleSummary description={description} />}

      {date && <ArticleDate date={date} variant={isCompact ? 'compact' : 'default'} />}
    </article>
  );
}
