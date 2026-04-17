import Link from 'next/link';
import Image from 'next/image';
import SeriesLabel from '@/app/components/SeriesLabel';
import ArticleSummary from '@/app/components/ArticleSummary';
import ArticleDate from '@/app/components/ArticleDate';

interface ArticlePreviewProps {
  title: string;
  subtitle?: string;
  slug: string;
  date?: Date | string | null;
  description?: string;
  image?: string;
  series?: string;
  seriesSlug?: string;
  order?: number;
  priority?: boolean;
  featured?: boolean;
}

export default function ArticlePreview({
  title,
  subtitle,
  slug,
  date,
  description,
  image,
  series,
  seriesSlug,
  order,
  priority = false,
  featured = false,
}: ArticlePreviewProps) {
  const displayTitle = subtitle ? `${title}: ${subtitle}` : title;

  return (
    <article className="group relative flex flex-col items-start">
      {image && (
        <div className="relative w-full overflow-hidden rounded-xl bg-muted aspect-video mb-6">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 672px) calc(100vw - 48px), 672px"
            className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
            priority={priority}
          />
          <div className="absolute right-2 bottom-2">
            {series && seriesSlug && (
              <SeriesLabel series={series} seriesSlug={seriesSlug} />
            )}
          </div>
        </div>
      )}

      {order && (
        <small className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 inline-block">
          Part {order}
        </small>
      )}

      <h2 className={`font-serif font-normal tracking-tight text-foreground ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
        <Link href={`/journal/${slug}`}>
          <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          <span className="relative z-10">{displayTitle}</span>
        </Link>
      </h2>

      {description && <ArticleSummary description={description} className={featured ? 'text-base' : undefined} />}

      {date && <ArticleDate date={date} />}
    </article>
  );
}
