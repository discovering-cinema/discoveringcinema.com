import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  BlogPosting,
  BreadcrumbList,
  Dataset,
  FAQPage,
  WithContext,
} from 'schema-dts';
import GithubSlugger from 'github-slugger';
import AuthorBio from '@/app/components/AuthorBio';
import TableOfContents from '@/app/components/TableOfContents';
import Image from 'next/image';
import JsonLd from '@/app/components/JsonLd';
import Link from 'next/link';
import TagPill from '@/app/components/TagPill';
import ArticleHeader from '@/app/components/ArticleHeader';
import { readingTime } from '@/app/lib/utils';
import RelatedArticles from '@/app/components/RelatedArticles';
import { SectionLabel } from '@/app/components/SectionLabel';
import { allPosts, allSeries } from 'content-collections';
import Mdx from '@/app/components/Mdx';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: 'Journal Entry' };
  }

  const fullTitle = post.subtitle
    ? `${post.title}: ${post.subtitle}`
    : post.title;
  const ogTitle = post.opengraph?.title ?? fullTitle;
  const ogDescription = post.opengraph?.description ?? post.description;

  return {
    title: fullTitle,
    description: ogDescription || post.description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      url: `https://discoveringcinema.com/journal/${slug}`,
      images: [
        {
          url: `/api/og?type=post&slug=${encodeURIComponent(slug)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`/api/og?type=post&slug=${encodeURIComponent(slug)}`],
    },
    alternates: {
      canonical: `/journal/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const slugger = new GithubSlugger();
  const headings = [...post.body.raw.matchAll(/^## (.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: slugger.slug(m[1].trim()),
  }));

  // Series logic
  const seriesSlug = post.seriesSlug;
  const series = allSeries.find((s) => s.slug === seriesSlug);
  const seriesName = series?.title || post.series;

  let seriesPosts: { title: string; slug: string; current: boolean }[] = [];
  let nextPost: { title: string; slug: string } | null = null;

  if (seriesName && seriesSlug) {
    seriesPosts = allPosts
      .filter((p) => p.seriesSlug === seriesSlug)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((p) => ({
        title: p.subtitle ? `${p.title}: ${p.subtitle}` : p.title,
        slug: p.slug,
        current: p.slug === slug,
      }));

    const currentIndex = seriesPosts.findIndex((p) => p.current);
    if (currentIndex !== -1 && currentIndex < seriesPosts.length - 1) {
      nextPost = seriesPosts[currentIndex + 1];
    }
  }

  const faq: FAQPage | null = post.faq
    ? {
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  const dataset: Dataset | null = post.dataset
    ? {
        '@type': 'Dataset',
        name: post.dataset.name,
        description: post.dataset.description,
        creator: {
          '@type': 'Organization',
          name: post.dataset.creator,
        },
        variableMeasured: post.dataset.variableMeasured?.map((v) => ({
          '@type': 'PropertyValue',
          name: v.name,
          value: v.value,
        })) || [],
        distribution: post.dataset.distribution?.map((d) => ({
          '@type': 'DataDownload',
          encodingFormat: d.encodingFormat,
          contentUrl: d.contentUrl,
        })) || [],
      }
    : null;

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://discoveringcinema.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: 'https://discoveringcinema.com/journal',
      },
      ...slugArray.slice(0, -1).map((part, index) => ({
        '@type': 'ListItem' as const,
        position: 3 + index,
        name: part
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        item: `https://discoveringcinema.com/journal/${slugArray.slice(0, index + 1).join('/')}`,
      })),
      {
        '@type': 'ListItem',
        position: 3 + (slugArray.length - 1),
        name: post.title,
        item: `https://discoveringcinema.com/journal/${slug}`,
      },
    ],
  };

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.subtitle ? `${post.title}: ${post.subtitle}` : post.title,
    description: post.description,
    image: post.image
      ? `https://discoveringcinema.com${post.image}`
      : undefined,
    datePublished: post.date ? new Date(post.date).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: 'Christopher Bray',
      url: 'https://discoveringcinema.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Discovering Cinema',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://discoveringcinema.com/journal/${slug}`,
      breadcrumb: breadcrumbList,
      hasPart: [...(faq ? [faq] : []), ...(dataset ? [dataset] : [])],
    },
  };

  return (
    <>
      <div className="py-8">
        <JsonLd data={jsonLd} />

        {/* ── Full-width title and hero ── */}
        {post.title && (
          <ArticleHeader
            title={post.title}
            subtitle={post.subtitle}
            author="Christopher Bray"
            date={post.date}
            readingTime={readingTime(post.body.raw)}
          />
        )}
        {post.image && (
          <div className="relative mb-12">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
              <Image
                src={post.image}
                alt={post.imageDescription || post.title || ''}
                fill
                sizes="(max-width: 1023px) calc(100vw - 48px), calc(min(100vw, 1024px) - 48px)"
                className="object-cover"
                priority
              />
            </div>
            {post.imageDescription && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
                {post.imageDescription}
              </p>
            )}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-12 lg:items-stretch">
          {/* ── Main column (2/3) ── */}
          <article className="prose max-w-none lg:col-span-2">
            {seriesPosts.length > 0 && (
              <div className="mb-10 bg-muted/60 rounded-lg p-5 not-prose">
                <SectionLabel className="mb-4 flex flex-col sm:flex-row gap-2">
                  In this series:{' '}
                  {seriesSlug ? (
                    <Link
                      href={`/journal/series/${seriesSlug}`}
                      className="text-primary hover:underline"
                    >
                      {seriesName}
                    </Link>
                  ) : (
                    seriesName
                  )}
                </SectionLabel>
                <nav>
                  <ol className="space-y-3">
                    {seriesPosts.map((p, index) => (
                      <li
                        key={p.slug}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="text-muted-foreground font-mono mt-0.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {p.current ? (
                          <span className="font-medium text-primary">
                            {p.title}
                          </span>
                        ) : (
                          <Link
                            href={`/journal/${p.slug}`}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {p.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            )}

            <Mdx code={post.body.code} />

            {nextPost && (
              <div className="mt-12 pl-6 border-l-2 border-primary not-prose">
                <SectionLabel as="h3" className="mb-2">
                  Next in series
                </SectionLabel>
                <Link
                  href={`/journal/${nextPost.slug}`}
                  className="group flex items-center justify-between gap-4"
                >
                  <span className="text-xl font-serif text-foreground group-hover:text-primary transition-colors">
                    {nextPost.title}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="ml-1 h-4 w-4 shrink-0 stroke-current text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
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
          </article>

          {/* ── Sidebar (1/3) — desktop only ── */}
          <aside className="hidden lg:block" aria-label="Sidebar">
            <div className="sticky top-8">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <AuthorBio lastWatched={post.lastWatched} />
          </div>
          {post.tags && post.tags.length > 0 && (
            <aside className="mt-8 lg:mt-0">
              <SectionLabel className="mb-4">
                Explore more on these topics
              </SectionLabel>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </aside>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-16">
            <RelatedArticles currentSlug={slug} currentTags={post.tags || []} />
          </div>
        )}
      </div>
    </>
  );
}

export function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}
