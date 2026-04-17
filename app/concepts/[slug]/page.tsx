import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DefinedTerm, FAQPage, BreadcrumbList, WithContext } from 'schema-dts';
import matter from 'gray-matter';
import Image from 'next/image';
import JsonLd from '@/app/components/JsonLd';
import Link from 'next/link';
import GithubSlugger from 'github-slugger';
import { getAllConcepts, getAllPosts } from '@/app/lib/posts';
import ArticleSummary from '@/app/components/ArticleSummary';
import TagPill from '@/app/components/TagPill';
import QAndA from '@/app/components/QAndA';
import TableOfContents from '@/app/components/TableOfContents';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import ConceptCard from '@/app/components/ConceptCard';
import { SectionLabel } from '@/app/components/SectionLabel';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const filePath = path.join(
      process.cwd(),
      'content/concepts',
      `${slug}.mdx`,
    );
    const { data: frontmatter } = matter(fs.readFileSync(filePath, 'utf8'));

    return {
      title: frontmatter?.title,
      description: frontmatter?.description,
      openGraph: {
        title: frontmatter?.title,
        description: frontmatter?.description,
        type: 'article',
        url: `https://discoveringcinema.com/concepts/${slug}`,
        ...(frontmatter?.image && {
          images: [{ url: frontmatter.image, alt: frontmatter.imageDescription || frontmatter.title }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter?.title,
        description: frontmatter?.description,
        ...(frontmatter?.image && { images: [frontmatter.image] }),
      },
      alternates: {
        canonical: `/concepts/${slug}`,
      },
    };
  } catch {
    return { title: 'Concept' };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), 'content/concepts', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter } = matter(fileContent);

  const slugger = new GithubSlugger();
  const headings = [...fileContent.matchAll(/^## (.+)$/gm)].map((m) => ({
    text: m[1].trim(),
    id: slugger.slug(m[1].trim()),
  }));

  const { default: Concept } = await import(`@/content/concepts/${slug}.mdx`);

  // Resolve related articles
  const relatedArticleSlugs: string[] = frontmatter.relatedArticles || [];
  const relatedPosts =
    relatedArticleSlugs.length > 0
      ? getAllPosts().filter((post) => relatedArticleSlugs.includes(post.slug))
      : [];

  type Resource = { title: string; url: string; type?: string };
  const resources: Resource[] = frontmatter.resources || [];
  const otherConcepts = getAllConcepts().filter((c) => c.slug !== slug).slice(0, 3);

  const faq: FAQPage | null = frontmatter.faq
    ? {
        '@type': 'FAQPage',
        mainEntity: frontmatter.faq.map(
          (item: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          }),
        ),
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
        name: frontmatter.title,
        item: `https://discoveringcinema.com/concepts/${slug}`,
      },
    ],
  };

  const jsonLd: WithContext<DefinedTerm> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: frontmatter.title,
    description: frontmatter.description,
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

        {/* ── Full-width title and hero ── */}
        {frontmatter?.title && (
          <TitleLockup>
            <Title>{frontmatter.title}</Title>
          </TitleLockup>
        )}
        {frontmatter?.image && (
          <div className="relative mb-12">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
              <Image
                src={frontmatter.image}
                alt={frontmatter.imageDescription || frontmatter.title || ''}
                fill
                sizes="(max-width: 1023px) calc(100vw - 48px), calc(min(100vw, 1024px) - 48px)"
                className="object-cover"
                priority
              />
            </div>
            {frontmatter.imageDescription && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
                {frontmatter.imageDescription}
              </p>
            )}
          </div>
        )}

        {/* ── 2/3 + 1/3 grid ── */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-12 lg:items-stretch">
          {/* Main column (2/3) */}
          <article className="prose max-w-none lg:col-span-2">
            <Concept />

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
          <aside
            className="hidden lg:block"
            aria-label="Sidebar"
          >
            <div className="sticky top-8 space-y-12">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        {(frontmatter?.faq?.length > 0 || frontmatter?.tags?.length > 0) && (
          <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-12 space-y-12 lg:space-y-0">
            <div className="space-y-12 lg:col-span-2">
              {frontmatter?.faq && frontmatter.faq.length > 0 && (
                <div>
                  <SectionLabel className="mb-6">Frequently Asked Questions</SectionLabel>
                  <QAndA items={frontmatter.faq} />
                </div>
              )}
            </div>

            {frontmatter?.tags && frontmatter.tags.length > 0 && (
              <aside className="flex flex-col gap-8">
                {resources.length > 0 && (
                  <div>
                    <SectionLabel className="mb-4">External resources</SectionLabel>
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
                  <SectionLabel className="mb-4">Explore more on these topics</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.tags.map((tag: string) => (
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
