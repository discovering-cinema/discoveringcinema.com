import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllSeries } from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'Series | Discovering Cinema',
  description: 'Multi-part investigations into cinema, policy, and the moving image.',
  openGraph: {
    title: 'Series | Discovering Cinema',
    description: 'Multi-part investigations into cinema, policy, and the moving image.',
    type: 'website',
    url: 'https://discoveringcinema.com/journal/series',
  },
  alternates: {
    canonical: '/journal/series',
  },
};

export default function SeriesIndex() {
  const series = getAllSeries();

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Series | Discovering Cinema',
    description: 'Multi-part investigations into cinema, policy, and the moving image.',
    url: 'https://discoveringcinema.com/journal/series',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: series.map((s, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://discoveringcinema.com/journal/series/${s.slug}`,
        name: s.name,
      })),
    },
  };

  return (
    <>
      <Header />
      <JsonLd data={jsonLd} />
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
          Series
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          Multi-part investigations into cinema, policy, and the moving image.
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {series.map((s) => {
          const coverImage = s.posts[0]?.image || '';
          return (
            <article key={s.slug} className="group relative flex flex-col items-start">
              <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={s.name}
                    fill
                    sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    <span className="font-serif italic">Discovering Cinema</span>
                  </div>
                )}
              </div>
              <small className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 inline-block">
                {s.posts.length} {s.posts.length === 1 ? 'article' : 'articles'}
              </small>
              <h2 className="font-serif text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
                <Link href={`/journal/series/${s.slug}`}>
                  <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                  <span className="relative z-10">{s.name}</span>
                </Link>
              </h2>
              {s.description && (
                <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {s.description}
                </p>
              )}
              <div
                aria-hidden="true"
                className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
              >
                View series
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
          );
        })}
      </div>
    </>
  );
}
