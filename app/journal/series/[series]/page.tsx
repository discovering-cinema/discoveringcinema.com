import Link from 'next/link';
import Header from '@/app/components/Header';
import ArticlePreview from '@/app/components/ArticlePreview';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllSeries } from '@/app/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series: seriesSlug } = await params;
  const all = getAllSeries();
  const s = all.find((x) => x.slug === seriesSlug);
  if (!s) return { title: 'Series | Discovering Cinema' };

  return {
    title: `${s.name} | Discovering Cinema`,
    description: s.description || `All articles in the "${s.name}" series.`,
    openGraph: {
      title: `${s.name} | Discovering Cinema`,
      description: s.description || `All articles in the "${s.name}" series.`,
      type: 'website',
      url: `https://discoveringcinema.com/journal/series/${seriesSlug}`,
    },
    alternates: {
      canonical: `/journal/series/${seriesSlug}`,
    },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series: seriesSlug } = await params;
  const all = getAllSeries();
  const s = all.find((x) => x.slug === seriesSlug);

  if (!s) return null;

  const posts = s.posts;

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${s.name} | Discovering Cinema`,
    description: s.description || `All articles in the "${s.name}" series.`,
    url: `https://discoveringcinema.com/journal/series/${seriesSlug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://discoveringcinema.com/journal/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <Header />
      <JsonLd data={jsonLd} />
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/journal/series"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4 stroke-current rotate-180"
            >
              <path
                d="M6.75 5.75 9.25 8l-2.5 2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All series
          </Link>
        </div>
        <h1 className="text-center text-balance font-playfair text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight tracking-tight mb-16">
          {s.name}
        </h1>
        {s.description && (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {s.description}
          </p>
        )}
      </header>

      <div className="flex flex-col gap-16">
        {posts.map((post, index) => (
          <ArticlePreview
            key={post.slug}
            title={post.title}
            slug={post.slug}
            date={post.date}
            description={post.description}
            image={post.image}
            order={post.order}
            priority={index === 0}
          />
        ))}
      </div>
    </>
  );
}

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ series: s.slug }));
}
