import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import {CollectionPage, WithContext} from 'schema-dts';
import {Metadata} from 'next';
import {getAllPosts} from '@/app/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `Articles tagged with "${decodedTag}" | Discovering Cinema`,
    description: `A collection of articles about ${decodedTag} in cinema.`,
    alternates: {
      canonical: `/journal/tag/${tag}`,
    },
  };
}

export default async function TagIndex({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const posts = getAllPosts()
    .filter((post) => 
      post.tags.some((t: string) => t.toLowerCase() === decodedTag.toLowerCase())
    )
    .map((post) => ({
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
    name: `Articles tagged with "${decodedTag}" | Discovering Cinema`,
    description: `A collection of articles about ${decodedTag} in cinema.`,
    url: `https://discoveringcinema.com/journal/tag/${tag}`,
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
            href="/journal"
            className="text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors flex items-center gap-1"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 stroke-current rotate-180">
              <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Journal
          </Link>
        </div>
        <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
          Tag: {decodedTag}
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with "{decodedTag}".
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col items-start"
          >
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
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
                <div className="flex h-full items-center justify-center text-zinc-400">
                  <span className="font-serif italic">Discovering Cinema</span>
                </div>
              )}
            </div>
            {post.date && (
              <time
                className="relative z-10 mb-3 flex items-center text-sm text-zinc-600 dark:text-zinc-400 pl-3.5"
                dateTime={post.date}
              >
                <span
                  className="absolute inset-y-0 left-0 flex items-center"
                  aria-hidden="true"
                >
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </span>
                {post.date}
              </time>
            )}
            {post.series && post.seriesSlug && (
              <Link
                href={`/journal/series/${post.seriesSlug}`}
                className="relative z-10 bg-teal-50 dark:bg-teal-900/30 py-1 px-2 rounded text-teal-600 dark:text-teal-400 mb-4 inline-block hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
              >
                <small>Series: <span className="font-medium">{post.series}</span></small>
              </Link>
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
