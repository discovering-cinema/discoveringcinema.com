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
  const [featuredPost, ...remainingPosts] = posts.slice(0, 4);
  const hasMorePosts = posts.length > 4;
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
      <section className="pt-8 pb-6 border-b border-border mb-12">
        <nav className="flex items-center justify-between">
          <h1 className="text-foreground flex flex-col sm:flex-row items-baseline space-x-2 uppercase">
            <span className="font-montserrat font-medium tracking-[0.2em] text-sm">Discovering</span>
            <span className="font-playfair font-bold text-2xl">Cinema</span>
          </h1>
          <div className="flex gap-6">
            <Link
              href="/journal"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Journal
            </Link>
            <Link
              href="/concepts"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Concepts
            </Link>
          </div>
        </nav>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <article className="group relative flex flex-col items-start mb-12">
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
            {featuredPost.image ? (
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <span className="font-serif italic">Discovering Cinema</span>
              </div>
            )}
          </div>
          {featuredPost.series && featuredPost.seriesSlug && (
            <Link
              href={`/journal/series/${featuredPost.seriesSlug}`}
              className="relative z-10 bg-accent/20 text-accent-foreground py-1 px-2 rounded mb-4 inline-block hover:bg-accent/30 transition-colors"
            >
              <small>Series: <span className="font-medium">{featuredPost.series}</span></small>
            </Link>
          )}
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
            <Link href={`/journal/${featuredPost.slug}`}>
              <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
              <span className="relative z-10">{featuredPost.title}</span>
            </Link>
          </h2>
          {featuredPost.description && (
            <p className="relative z-10 mt-2 text-sm text-muted-foreground">
              {featuredPost.description}
            </p>
          )}
          {featuredPost.date && (
              <time
                  className="relative z-10 my-3 flex items-center text-sm text-muted-foreground pl-3.5"
                  dateTime={featuredPost.date.toISOString()}
              >
              <span
                  className="absolute inset-y-0 left-0 flex items-center"
                  aria-hidden="true"
              >
                <span className="h-4 w-0.5 rounded-full bg-border" />
              </span>
                {featuredPost.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
          )}
        </article>
      )}

      {/* Secondary Articles Grid */}
      {remainingPosts.length > 0 && (
        <section className="border-t border-border pt-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pl-3 relative">
              <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-primary" aria-hidden="true" />
              Journal & Research
            </span>
            {hasMorePosts && (
              <Link
                href="/journal"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                See all →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col items-start"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-muted">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 672px) calc(50vw - 36px), 312px"
                      className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0 delay-100"
                    />
                  ) : (
                    <div className="h-full bg-muted" />
                  )}
                </div>
                <h2 className="font-serif text-lg font-normal tracking-tight text-foreground">
                  <Link href={`/journal/${post.slug}`}>
                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                    <span className="relative z-10">{post.title}</span>
                  </Link>
                </h2>
                {post.description && (
                  <p className="relative z-10 my-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.description}
                  </p>
                )}
                {post.date && (
                    <time
                        className="relative z-10 mb-2 flex items-center text-xs text-muted-foreground pl-3.5"
                        dateTime={post.date.toISOString()}
                    >
                    <span
                        className="absolute inset-y-0 left-0 flex items-center"
                        aria-hidden="true"
                    >
                      <span className="h-3 w-0.5 rounded-full bg-border" />
                    </span>
                      {post.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Concepts */}
      {displayEducationalContent.length > 0 && (
        <section className="border-t border-border py-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              <span className="inline-block h-2 w-2 rounded-sm bg-accent" aria-hidden="true" />
              Concepts
            </span>
            {educationalContent.length > 3 && (
                <Link
                    href="/journal"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  See all →
                </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {displayEducationalContent.map((item) => (
              <Link
                key={item.urlPath}
                href={item.urlPath}
                className="group block rounded-lg border border-border bg-concept-card px-5 py-4 hover:border-foreground/30 transition-colors"
              >
                <small className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 inline-block">
                  Concept
                </small>
                <p className="font-serif text-base font-normal text-foreground group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
