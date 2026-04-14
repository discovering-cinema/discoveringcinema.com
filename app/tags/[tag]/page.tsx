import Link from 'next/link';
import Header from '@/app/components/Header';
import ArticlePreview from '@/app/components/ArticlePreview';
import ConceptCard from '@/app/components/ConceptCard';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import {
  getAllPosts,
  getAllEducationalContent,
  getAllTags,
  getTagSummary,
} from '@/app/lib/posts';

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
    description:
      summary ??
      `Everything tagged with "${decodedTag}" on Discovering Cinema.`,
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

  const posts = getAllPosts().filter((post) =>
    post.tags.some((t: string) => t.toLowerCase() === decodedTag.toLowerCase()),
  );

  const educationalItems = getAllEducationalContent().filter((item) =>
    item.tags.some((t: string) => t.toLowerCase() === decodedTag.toLowerCase()),
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
        <h1 className="text-center text-balance font-playfair text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight tracking-tight mb-16">
          {decodedTag}
        </h1>
        {summary && (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {summary}
          </p>
        )}
      </header>

      {posts.length > 0 && (
        <section className="mb-20">
          {educationalItems.length > 0 && (
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Journal
            </h2>
          )}
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
        </section>
      )}

      {educationalItems.length > 0 && (
        <section>
          {posts.length > 0 && (
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Educational Material
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {educationalItems.map((item) => (
              <ConceptCard
                key={item.urlPath}
                href={item.urlPath}
                label={item.contentType}
                title={item.title}
                description={item.description}
              />
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
