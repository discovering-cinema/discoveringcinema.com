import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import {CollectionPage, WithContext} from 'schema-dts';
import {Metadata} from 'next';
import {getAllPosts} from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'Journal | Discovering Cinema',
  description:
    'A collection of articles about cinema, craft, and preservation.',
  openGraph: {
    title: 'Journal | Discovering Cinema',
    description:
      'A collection of articles about cinema, craft, and preservation.',
    type: 'website',
    url: 'https://discoveringcinema.com/journal',
  },
  alternates: {
    canonical: '/journal',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function JournalIndex() {
  const posts = getAllPosts().map((post) => ({
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
    name: 'Journal | Discovering Cinema',
    description:
      'A collection of articles about cinema, craft, and preservation.',
    url: 'https://discoveringcinema.com/journal',
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
        <h1 className="font-serif text-5xl font-normal tracking-tight text-foreground">
          Journal
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Thoughts on cinema, technology, and the invisible threads that connect
          them.
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col items-start"
          >
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={posts.indexOf(post) === 0}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <span className="font-serif italic">Discovering Cinema</span>
                </div>
              )}
            </div>
            {post.date && (
              <time
                className="relative z-10 mb-3 flex items-center text-sm text-muted-foreground pl-3.5"
                dateTime={post.date}
              >
                <span
                  className="absolute inset-y-0 left-0 flex items-center"
                  aria-hidden="true"
                >
                  <span className="h-4 w-0.5 rounded-full bg-border" />
                </span>
                {post.date}
              </time>
            )}
            {post.series && post.seriesSlug && (
              <Link
                href={`/journal/series/${post.seriesSlug}`}
                className="relative z-10 bg-accent/20 text-accent-foreground py-1 px-2 rounded mb-4 inline-block hover:bg-accent/30 transition-colors"
              >
                <small>Series: <span className="font-medium">{post.series}</span></small>
              </Link>
            )}
            <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
              <Link href={`/journal/${post.slug}`}>
                <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                <span className="relative z-10">{post.title}</span>
              </Link>
            </h2>
            {post.description && (
              <p className="relative z-10 mt-2 text-sm text-muted-foreground">
                {post.description}
              </p>
            )}
            <div
              aria-hidden="true"
              className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary"
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
