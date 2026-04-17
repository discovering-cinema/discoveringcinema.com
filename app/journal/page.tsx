import ArticlePreview from '@/app/components/ArticlePreview';
import JsonLd from '@/app/components/JsonLd';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllPosts } from '@/app/lib/posts';

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
  const posts = getAllPosts();

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
      <JsonLd data={jsonLd} />
      <header className="mb-16 text-center">
        <TitleLockup>
          <Title>Journal</Title>
          <Subtitle>
            Thoughts on cinema, technology, and the invisible threads that
            connect them.
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
