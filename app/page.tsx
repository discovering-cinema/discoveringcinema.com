import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/app/components/JsonLd';
import {WebSite, WithContext} from 'schema-dts';
import {Metadata} from 'next';
import {getAllPosts, getAllEducationalContent} from '@/app/lib/posts';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function Home() {
  const posts = getAllPosts();
  const [featuredPost, ...remainingPosts] = posts.slice(0, 5);
  const hasMorePosts = posts.length > 5;
  const educationalContent = getAllEducationalContent();
  const displayEducationalContent = educationalContent.slice(0, 3);

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Discovering Cinema',
    url: 'https://discoveringcinema.com',
    description: 'A research lab dedicated to the history of film.',
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Masthead */}
      <section className="pt-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-12">
        <nav className="flex items-center justify-between">
          <h1 className="font-serif text-xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
            Discovering Cinema
          </h1>
          <div className="flex gap-6">
            <Link
              href="/journal"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Journal
            </Link>
            <Link
              href="/manifesto"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Manifesto
            </Link>
          </div>
        </nav>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <article className="group relative flex flex-col items-start mb-12">
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {featuredPost.image ? (
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                <span className="font-serif italic">Discovering Cinema</span>
              </div>
            )}
          </div>
          {featuredPost.date && (
            <time
              className="relative z-10 mb-3 flex items-center text-sm text-zinc-600 dark:text-zinc-400 pl-3.5"
              dateTime={featuredPost.date.toISOString()}
            >
              <span
                className="absolute inset-y-0 left-0 flex items-center"
                aria-hidden="true"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </span>
              {featuredPost.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}
          {featuredPost.series && featuredPost.seriesSlug && (
            <Link
              href={`/journal/series/${featuredPost.seriesSlug}`}
              className="relative z-10 bg-teal-50 dark:bg-teal-900/30 py-1 px-2 rounded text-teal-600 dark:text-teal-400 mb-4 inline-block hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
            >
              <small>Series: <span className="font-medium">{featuredPost.series}</span></small>
            </Link>
          )}
          <h2 className="font-serif text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
            <Link href={`/journal/${featuredPost.slug}`}>
              <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
              <span className="relative z-10">{featuredPost.title}</span>
            </Link>
          </h2>
          {featuredPost.description && (
            <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {featuredPost.description}
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
      )}

      {/* Secondary Articles Grid */}
      {remainingPosts.length > 0 && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
              Journal & Research
            </span>
            {hasMorePosts && (
              <Link
                href="/journal"
                className="text-sm font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
              >
                See all →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {remainingPosts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col items-start"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 672px) calc(50vw - 36px), 312px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full bg-zinc-100 dark:bg-zinc-800" />
                  )}
                </div>
                {post.date && (
                  <time
                    className="relative z-10 mb-2 flex items-center text-xs text-zinc-600 dark:text-zinc-400 pl-3.5"
                    dateTime={post.date.toISOString()}
                  >
                    <span
                      className="absolute inset-y-0 left-0 flex items-center"
                      aria-hidden="true"
                    >
                      <span className="h-3 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    </span>
                    {post.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                )}
                <h2 className="font-serif text-lg font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
                  <Link href={`/journal/${post.slug}`}>
                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                    <span className="relative z-10">{post.title}</span>
                  </Link>
                </h2>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Concepts */}
      {displayEducationalContent.length > 0 && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 py-8 mb-16">
          <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-3">
            Concepts
          </span>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-5">
            There are concepts in film theory that, once you know them, change how you watch. The punctum explains why
            two people leave the same film having been moved by entirely different moments. Embodied spectatorship
            explains why your body responds to what is on screen before your mind has caught up. These pages introduce
            those frameworks clearly, explain where they come from, and show what they look like in practice.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-3 gap-x-8">
            {displayEducationalContent.map((item) => (
              <Link
                key={item.urlPath}
                href={item.urlPath}
                className="font-serif text-base text-zinc-900 hover:text-teal-500 dark:text-zinc-100 dark:hover:text-teal-400 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
          {educationalContent.length > 3 && (
            <Link
              href="/concepts"
              className="mt-4 inline-block text-sm font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
            >
              All concepts →
            </Link>
          )}
        </section>
      )}
    </>
  );
}
