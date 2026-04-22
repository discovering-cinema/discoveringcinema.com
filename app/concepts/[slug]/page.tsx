import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DefinedTerm, FAQPage, BreadcrumbList, WithContext } from 'schema-dts';
import Image from 'next/image';
import JsonLd from '@/app/components/JsonLd';
import Link from 'next/link';
import GithubSlugger from 'github-slugger';
import { getAllConcepts, getAllPosts } from '@/app/lib/posts';
import ArticleSummary from '@/app/components/ArticleSummary';
import TagPill from '@/app/components/TagPill';
import QAndA from '@/app/components/QAndA';
import TableOfContents from '@/app/components/TableOfContents';
import ArticleHeader from '@/app/components/ArticleHeader';
import ConceptCard from '@/app/components/ConceptCard';
import { SectionLabel } from '@/app/components/SectionLabel';
import { allConcepts } from 'content-collections';
import Mdx from '@/app/components/Mdx';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = allConcepts.find((c) => c.slug === slug);

  if (!concept) {
    return { title: 'Concept Not Found' };
  }

  const fullTitle = concept.subtitle
    ? `${concept.title}: ${concept.subtitle}`
    : concept.title;
  const ogTitle = concept.opengraph?.title ?? fullTitle;
  const ogDescription = concept.opengraph?.description ?? concept.description;

  return {
    title: fullTitle,
    description: ogDescription || concept.description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: `https://discoveringcinema.com/concepts/${slug}`,
      images: [
        {
          url: `/api/og?type=concept&slug=${encodeURIComponent(slug)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`/api/og?type=concept&slug=${encodeURIComponent(slug)}`],
    },
    alternates: {
      canonical: `/concepts/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = allConcepts.find((c) => c.slug === slug);

  if (!concept) {
    notFound();
  }

  const slugger = new GithubSlugger();
  // Using concept.body.raw to find headings
  const headings = [...concept.body.raw.matchAll(/^## (.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: slugger.slug(m[1].trim()),
  }));

  // Resolve related articles
  const relatedArticleSlugs: string[] = concept.relatedArticles || [];
  const relatedPosts =
    relatedArticleSlugs.length > 0
      ? getAllPosts().filter((post) => relatedArticleSlugs.includes(post.slug))
      : [];

  const resources = concept.resources || [];
  const otherConcepts = getAllConcepts()
    .filter((c) => c.slug !== slug)
    .slice(0, 3);

  const faq: FAQPage | null = concept.faq
    ? {
        '@type': 'FAQPage',
        mainEntity: concept.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
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
        name: 'Concepts',
        item: 'https://discoveringcinema.com/concepts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: concept.title,
        item: `https://discoveringcinema.com/concepts/${slug}`,
      },
    ],
  };

  const jsonLd: WithContext<DefinedTerm> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: concept.title,
    description: concept.description,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Discovering Cinema Concepts',
      url: 'https://discoveringcinema.com/concepts',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://discoveringcinema.com/concepts/${slug}`,
      breadcrumb: breadcrumbList,
      ...(faq ? { hasPart: [faq] } : {}),
    },
  };

  return (
    <>
      <div className="py-8">
        <JsonLd data={jsonLd} />

        <div className="mb-24">
          <ArticleHeader
            title={concept.title}
            subtitle={concept.subtitle}
            author="Christopher Bray"
          />
        </div>

        {concept?.image && (
          <div className="relative mb-12">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
              <Image
                src={concept.image}
                alt={(concept as any).imageDescription || concept.title || ''}
                fill
                sizes="(max-width: 1023px) calc(100vw - 48px), calc(min(100vw, 1024px) - 48px)"
                className="object-cover"
                priority
              />
            </div>
            { (concept as any).imageDescription && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
                {(concept as any).imageDescription}
              </p>
            )}
          </div>
        )}

        {/* ── 2/3 + 1/3 grid ── */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-12 lg:items-stretch">
          {/* Main column (2/3) */}
          <article className="prose max-w-none lg:col-span-2">
            <Mdx code={concept.body.code} />

            {relatedPosts.length > 0 && (
              <div className="mt-16 not-prose">
                <SectionLabel className="mb-6">Related Articles</SectionLabel>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/journal/${post.slug}`}
                      className="group flex flex-col p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="font-serif text-lg font-normal text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </span>
                      {post.description && (
                        <ArticleSummary description={post.description} />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar (1/3) — desktop only */}
          <aside className="hidden lg:block" aria-label="Sidebar">
            <div className="sticky top-8 space-y-12">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        {((concept?.faq?.length ?? 0) > 0 || (concept?.tags?.length ?? 0) > 0) && (
          <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-12 space-y-12 lg:space-y-0">
            <div className="space-y-12 lg:col-span-2">
              {concept?.faq && concept.faq.length > 0 && (
                <div>
                  <SectionLabel className="mb-6">
                    Frequently Asked Questions
                  </SectionLabel>
                  <QAndA items={concept.faq} />
                </div>
              )}
            </div>

            {concept?.tags && concept.tags.length > 0 && (
              <aside className="flex flex-col gap-8">
                {resources.length > 0 && (
                  <div>
                    <SectionLabel className="mb-4">
                      External resources
                    </SectionLabel>
                    <ul className="space-y-3">
                      {resources.map((resource) => (
                        <li key={resource.url}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-2 justify-between leading-snug"
                          >
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                              {resource.title}
                            </span>
                            {resource.type && (
                              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground bg-muted rounded px-1 py-0.5">
                                {resource.type}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <SectionLabel className="mb-4">
                    Explore more on these topics
                  </SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {concept.tags.map((tag: string) => (
                      <TagPill key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}

        {otherConcepts.length > 0 && (
          <div className="mt-16">
            <SectionLabel className="mb-6">Other concepts</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherConcepts.map((concept) => (
                <ConceptCard
                  key={concept.slug}
                  href={`/concepts/${concept.slug}`}
                  title={concept.title}
                  description={concept.description}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function generateStaticParams() {
  return getAllConcepts().map((concept) => ({
    slug: concept.slug,
  }));
}
