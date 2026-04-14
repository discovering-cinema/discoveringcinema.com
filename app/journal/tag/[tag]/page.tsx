import Link from 'next/link';
import Header from '@/app/components/Header';
import ArticlePreview from '@/app/components/ArticlePreview';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllPosts } from '@/app/lib/posts';

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

  const posts = getAllPosts().filter((post) =>
    post.tags.some((t: string) => t.toLowerCase() === decodedTag.toLowerCase()),
  );

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
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4 stroke-current rotate-180"
            >
              <path
                d="M6.75 5.75 9.25 8l-2.5 2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Journal
          </Link>
        </div>
        <h1 className="font-serif text-5xl font-normal tracking-tight text-foreground">
          Tag: {decodedTag}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged
          with &quot;{decodedTag}&quot;.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
        {posts.map((post, index) => (
          <ArticlePreview
            key={post.slug}
            title={post.title}
            slug={post.slug}
            date={post.date}
            description={post.description}
            image={post.image}
            series={post.series}
            seriesSlug={post.seriesSlug}
            priority={index === 0}
          />
        ))}
      </div>
    </>
  );
}
