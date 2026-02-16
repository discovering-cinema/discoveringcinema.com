import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import matter from 'gray-matter';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';

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
        series: frontmatter.series,
        date: frontmatter.date
          ? new Date(frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : null,
        description: frontmatter.description,
        tags: frontmatter.tags || [],
        image: frontmatter.image,
      };
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

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
        <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
          Journal
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
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
            {post.series && (
              <small className="bg-teal-50 py-1 px-2 rounded text-teal-600 dark:text-teal-400 mb-4 inline-block">
                Series: <span className="font-medium">{post.series}</span>
              </small>
            )}
            <h2 className="font-serif text-2xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
              <Link href={`/journal/${post.slug}`}>
                <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                <span className="relative z-10">{post.title}</span>
              </Link>
            </h2>
            {post.date && (
              <time
                className="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-600 dark:text-zinc-400 pl-3.5"
                dateTime={post.date}
              >
                <span
                  className="absolute inset-y-0 left-0 flex items-center"
                  aria-hidden="true"
                >
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </span>
                {post.date}
              </time>
            )}
            {post.description && (
              <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {post.description}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
