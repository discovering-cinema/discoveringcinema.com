import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllPosts, getAllEducationalContent, getAllTags, getTagSummary } from '@/app/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const summary = getTagSummary(decodedTag);

  return {
    title: `"${decodedTag}" | Discovering Cinema`,
    description: summary ?? `Everything tagged with "${decodedTag}" on Discovering Cinema.`,
    alternates: {
      canonical: `/tags/${tag}`,
    },
  };
}

export default async function TagPage({
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

  const educationalItems = getAllEducationalContent().filter((item) =>
    item.tags.some((t: string) => t.toLowerCase() === decodedTag.toLowerCase())
  );

  const totalCount = posts.length + educationalItems.length;
  const summary = getTagSummary(decodedTag);

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `"${decodedTag}" | Discovering Cinema`,
    description: `Everything tagged with "${decodedTag}" on Discovering Cinema.`,
    url: `https://discoveringcinema.com/tags/${tag}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...posts.map((post, index) => ({
          '@type': 'ListItem' as const,
          position: index + 1,
          url: `https://discoveringcinema.com/journal/${post.slug}`,
          name: post.title,
        })),
        ...educationalItems.map((item, index) => ({
          '@type': 'ListItem' as const,
          position: posts.length + index + 1,
          url: `https://discoveringcinema.com${item.urlPath}`,
          name: item.title,
        })),
      ],
    },
  };

  return (
    <>
      <Header />
      <JsonLd data={jsonLd} />
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
          {decodedTag}
        </h1>
        {summary && (
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {summary}
          </p>
        )}
        <p className={`${summary ? 'mt-4' : 'mt-6'} text-lg text-zinc-600 dark:text-zinc-400`}>
          {totalCount} {totalCount === 1 ? 'result' : 'results'}
        </p>
      </header>

      {posts.length > 0 && (
        <section className="mb-20">
          {educationalItems.length > 0 && (
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-8">
              Journal
            </h2>
          )}
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
        </section>
      )}

      {educationalItems.length > 0 && (
        <section>
          {posts.length > 0 && (
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-8">
              Educational Material
            </h2>
          )}
          <div className="flex flex-col gap-6">
            {educationalItems.map((item) => (
              <article key={item.urlPath} className="group relative flex flex-col items-start">
                <Link
                  href={item.urlPath}
                  className="block w-full p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <small className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 inline-block">
                    {item.contentType}
                  </small>
                  <h2 className="font-serif text-xl font-normal text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.description}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag) }));
}
