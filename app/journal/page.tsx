import Header from '@/app/components/Header';
import ArticlePreview from '@/app/components/ArticlePreview';
import JsonLd from '@/app/components/JsonLd';
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
      <Header />
      <JsonLd data={jsonLd} />
      <header className="mb-16 text-center">
        <h1 className="text-balance font-playfair text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight tracking-tight">
          Journal
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Thoughts on cinema, technology, and the invisible threads that connect
          them.
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
