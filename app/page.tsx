import Link from 'next/link';
import JsonLd from '@/app/components/JsonLd';
import ArticlePreview from '@/app/components/ArticlePreview';
import ConceptCard from '@/app/components/ConceptCard';
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
        <div className="mb-12">
          <ArticlePreview
            title={featuredPost.title}
            slug={featuredPost.slug}
            date={featuredPost.date}
            description={featuredPost.description}
            image={featuredPost.image}
            series={featuredPost.series}
            seriesSlug={featuredPost.seriesSlug}
            priority
          />
        </div>
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
              <ArticlePreview
                key={post.slug}
                title={post.title}
                slug={post.slug}
                date={post.date}
                description={post.description}
                image={post.image}
                variant="compact"
              />
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
              <ConceptCard
                key={item.urlPath}
                href={item.urlPath}
                label="Concept"
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
