import Link from 'next/link';
import ArticlePreview from '@/app/components/ArticlePreview';
import ConceptCard from '@/app/components/ConceptCard';
import JsonLd from '@/app/components/JsonLd';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import {
  getAllPosts,
  getAllEducationalContent,
  getAllTags,
  getTagSummary,
  getTagDisplayName,
  tagToSlug,
} from '@/app/lib/posts';
import { SectionLabel } from '@/app/components/SectionLabel';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const displayName = getTagDisplayName(tag);
  const summary = getTagSummary(tag);

  return {
    title: `"${displayName}" | Discovering Cinema`,
    description:
      summary ??
      `Everything tagged with "${displayName}" on Discovering Cinema.`,
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
  const displayName = getTagDisplayName(tag);

  const posts = getAllPosts().filter((post) =>
    post.tags.some((t: string) => tagToSlug(t) === tag),
  );

  const educationalItems = getAllEducationalContent().filter((item) =>
    item.tags.some((t: string) => tagToSlug(t) === tag),
  );

  const totalCount = posts.length + educationalItems.length;
  const summary = getTagSummary(tag);

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `"${displayName}" | Discovering Cinema`,
    description: `Everything tagged with "${displayName}" on Discovering Cinema.`,
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
      <JsonLd data={jsonLd} />
      <header className="mb-16">
        <TitleLockup>
          <Title className="mb-16">{displayName}</Title>
          {summary && <Subtitle>{summary}</Subtitle>}
        </TitleLockup>
      </header>

      {posts.length > 0 && (
        <section className="mb-20">
          {educationalItems.length > 0 && (
            <SectionLabel className="mb-6">Journal</SectionLabel>
          )}
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
        </section>
      )}

      {educationalItems.length > 0 && (
        <section>
          {posts.length > 0 && (
            <SectionLabel className="mb-6">Concepts</SectionLabel>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
  return getAllTags().map((tag) => ({ tag }));
}
