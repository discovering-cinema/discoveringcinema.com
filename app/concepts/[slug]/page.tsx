import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DefinedTerm, FAQPage, BreadcrumbList, WithContext } from 'schema-dts';
import matter from 'gray-matter';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import Link from 'next/link';
import GithubSlugger from 'github-slugger';
import { getAllConcepts, getAllPosts } from '@/app/lib/posts';
import ArticleSummary from '@/app/components/ArticleSummary';
import TagPill from '@/app/components/TagPill';
import QAndA from '@/app/components/QAndA';
import TableOfContents from '@/app/components/TableOfContents';

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
  const otherConcepts = getAllConcepts().filter((c) => c.slug !== slug);

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
      <Header />
      <div className="py-8">
        <JsonLd data={jsonLd} />

        {/* ── Full-width title and hero ── */}
        {frontmatter?.title && (
          <h1 className="text-center text-balance font-playfair text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight tracking-tight mb-16">
            {frontmatter.title}
          </h1>
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
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main column (2/3) */}
          <article className="prose max-w-none lg:col-span-2">
            <Concept />

            {frontmatter?.faq && frontmatter.faq.length > 0 && (
              <div className="mt-16 not-prose">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-6">
                  Frequently Asked Questions
                </h2>
                <QAndA items={frontmatter.faq} />
              </div>
            )}

            {frontmatter?.tags && frontmatter.tags.length > 0 && (
              <div className="mt-16 not-prose">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4">
                  Explore more on these topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag: string) => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="mt-16 not-prose">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-6">
                  Related Articles
                </h2>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/journal/${post.slug}`}
                      className="group flex flex-col p-4 rounded-xl border border-border hover:border-foreground/30 transition-colors"
                    >
                      <span className="font-serif text-lg font-normal text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </span>
                      {post.description && (
                        <ArticleSummary
                          description={post.description}
                          variant="compact"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar (1/3) — desktop only */}
          <aside
            className="hidden lg:flex lg:flex-col gap-8"
            aria-label="Sidebar"
          >
            <div className="sticky top-8">
              <TableOfContents headings={headings} />
            </div>

            <div className="mt-auto flex flex-col gap-8">
              {otherConcepts.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Other concepts
                  </h2>
                  <nav>
                    <ul className="space-y-2">
                      {otherConcepts.map((concept) => (
                        <li key={concept.slug}>
                          <Link
                            href={`/concepts/${concept.slug}`}
                            className="group flex flex-col gap-0.5 py-2 border-b border-border last:border-0"
                          >
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {concept.title}
                            </span>
                            {concept.description && (
                              <span className="text-xs text-muted-foreground line-clamp-2">
                                {concept.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {resources.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    External resources
                  </h2>
                  <ul className="space-y-3">
                    {resources.map((resource) => (
                      <li key={resource.url}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-2"
                        >
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                            {resource.title}
                          </span>
                          {resource.type && (
                            <span className="shrink-0 mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground border border-border rounded px-1 py-0.5">
                              {resource.type}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return getAllConcepts().map((concept) => ({
    slug: concept.slug,
  }));
}
