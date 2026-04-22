import Link from 'next/link';
import ArticlePreview from '@/app/components/ArticlePreview';
import JsonLd from '@/app/components/JsonLd';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import {
  getAllPosts,
  getAllTags,
  getTagDisplayName,
  tagToSlug,
} from '@/app/lib/posts';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const displayName = getTagDisplayName(tag);
  const title = `Articles tagged with "${displayName}"`;
  const description = `Explore a curated collection of articles, research, and deep dives focused on ${displayName} in cinema history and theory.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Discovering Cinema`,
      description,
      type: 'website',
      url: `https://discoveringcinema.com/journal/tag/${tag}`,
      images: [
        {
          url: `/api/og?type=journal-tag&tag=${encodeURIComponent(tag)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Discovering Cinema`,
      description,
      images: [`/api/og?type=journal-tag&tag=${encodeURIComponent(tag)}`],
    },
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
  const displayName = getTagDisplayName(tag);

  const posts = getAllPosts().filter((post) =>
    post.tags.some((t: string) => tagToSlug(t) === tag),
  );

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Articles tagged with "${displayName}" | Discovering Cinema`,
    description: `A collection of articles about ${displayName} in cinema.`,
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
        <TitleLockup>
          <Title>Tag: {displayName}</Title>
          <Subtitle>
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged
            with &quot;{displayName}&quot;.
          </Subtitle>
        </TitleLockup>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
        {posts.map((post, index) => (
          <ArticlePreview
            key={post.slug}
            title={post.title}
            subtitle={post.subtitle}
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
