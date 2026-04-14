import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllSeries } from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'Series | Discovering Cinema',
  description:
    'Multi-part investigations into cinema, policy, and the moving image.',
  openGraph: {
    title: 'Series | Discovering Cinema',
    description:
      'Multi-part investigations into cinema, policy, and the moving image.',
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
    description:
      'Multi-part investigations into cinema, policy, and the moving image.',
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
        <h1 className="font-serif text-5xl font-normal tracking-tight text-foreground">
          Series
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Multi-part investigations into cinema, policy, and the moving image.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
        {series.map((s) => {
          const coverImage = s.posts[0]?.image || '';
          return (
            <article
              key={s.slug}
              className="group relative flex flex-col items-start"
            >
              <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 672px) calc(50vw - 36px), 312px"
                    className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <span className="font-serif italic">
                      Discovering Cinema
                    </span>
                  </div>
                )}
              </div>
              <small className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-block">
                {s.posts.length} {s.posts.length === 1 ? 'article' : 'articles'}
              </small>
              <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
                <Link href={`/journal/series/${s.slug}`}>
                  <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                  <span className="relative z-10">{s.name}</span>
                </Link>
              </h2>
              {s.description && (
                <p className="relative z-10 mt-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              )}
              <div
                aria-hidden="true"
                className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary"
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
