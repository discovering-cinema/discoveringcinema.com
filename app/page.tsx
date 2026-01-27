import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import JsonLd from '@/app/components/JsonLd';
import { WebSite, WithContext } from 'schema-dts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

export default function Home() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);

  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx$/, ''),
        title: frontmatter.title || file.replace(/\.mdx$/, ''),
        date: frontmatter.date ? new Date(frontmatter.date) : null,
        description: frontmatter.description,
        tags: frontmatter.tags || ['Article'],
        image: frontmatter.image,
      };
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    });

  const displayPosts = posts.slice(0, 4);
  const hasMorePosts = posts.length > 4;

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Discovering Cinema',
    url: 'https://discoveringcinema.com',
    description: 'A research lab dedicated to the history of film.',
  };

  return (
    <div className="mx-auto max-w-2xl px-6">
      <JsonLd data={jsonLd} />
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100 md:text-6xl">
          Discovering Cinema
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          A research lab dedicated to the history of film.
        </p>
        <p className="mt-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          The streaming era has given us access to everything, yet narrowed what
          we actually watch. <strong>Discovering Cinema</strong> exists to widen
          the aperture.
        </p>
        <p className="mt-8 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          We are a multi-disciplinary collective building the future of film
          appreciation. Through data journalism, curated programming, and
          open-source engineering, we are creating a new ecosystem for discovery
          - one that values the historical record over the retention metric.
        </p>
      </section>

      {/* Journal Section */}
      <section className="py-12 border-t border-zinc-200 dark:border-zinc-800 mb-24">
        <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-8">
          Journal & Research
        </span>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {displayPosts.map((post) => (
            <div
              key={post.slug}
              className="flex flex-col py-8 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex-1 sm:pr-12">
                <Link href={`/journal/${post.slug}`} className="block group">
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 sm:hidden">
                    {post.image && (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={displayPosts.indexOf(post) === 0}
                      />
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-normal text-zinc-900 transition-colors group-hover:text-teal-500 dark:text-zinc-100 dark:group-hover:text-teal-400">
                    {post.title}
                  </h3>
                  {post.date && (
                    <time className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                      {post.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.description && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {post.description}
                    </p>
                  )}
                </Link>
              </div>
              <div className="flex flex-col items-end sm:mt-1">
                <div className="relative mt-4 hidden aspect-video w-40 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 sm:block">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMorePosts && (
          <div className="mt-12">
            <Link
              href="/journal"
              className="inline-flex items-center text-sm font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
            >
              View all articles
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="ml-1 h-4 w-4 stroke-current"
              >
                <path
                  d="M6.75 5.75 9.25 8l-2.5 2.25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
