import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
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

  const posts = s.posts.map((post) => ({
    ...post,
    date: post.date
      ? post.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null,
  }));

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
            className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors flex items-center gap-1"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 stroke-current rotate-180">
              <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All series
          </Link>
        </div>
        <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
          {s.name}
        </h1>
        {s.description && (
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {s.description}
          </p>
        )}
        <p className={`${s.description ? 'mt-4' : 'mt-6'} text-lg text-zinc-600 dark:text-zinc-400`}>
          {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {posts.map((post, index) => (
          <article key={post.slug} className="group relative flex flex-col items-start">
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400">
                  <span className="font-serif italic">Discovering Cinema</span>
                </div>
              )}
            </div>
            {post.order && (
              <small className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 inline-block">
                Part {post.order}
              </small>
            )}
            {post.date && (
              <time
                className="relative z-10 mb-3 flex items-center text-sm text-zinc-600 dark:text-zinc-400 pl-3.5"
                dateTime={post.date}
              >
                <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </span>
                {post.date}
              </time>
            )}
            <h2 className="font-serif text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
              <Link href={`/journal/${post.slug}`}>
                <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                <span className="relative z-10">{post.title}</span>
              </Link>
            </h2>
            {post.description && (
              <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {post.description}
              </p>
            )}
            <div
              aria-hidden="true"
              className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
            >
              Read article
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="ml-1 h-4 w-4 stroke-current transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M6.75 5.75 9.25 8l-2.5 2.25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ series: s.slug }));
}
