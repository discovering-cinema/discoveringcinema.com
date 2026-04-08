// @ts-nocheck
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
import { getAllConcepts, getAllPosts } from '@/app/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const filePath = path.join(process.cwd(), 'content/concepts', `${slug}.mdx`);
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

  const { default: Concept } = await import(`@/content/concepts/${slug}.mdx`);

  // Resolve related articles
  const relatedArticleSlugs: string[] = frontmatter.relatedArticles || [];
  const relatedPosts = relatedArticleSlugs.length > 0
    ? getAllPosts().filter((post) => relatedArticleSlugs.includes(post.slug))
    : [];

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
        <article className="prose max-w-none">
          {frontmatter?.title && <h1>{frontmatter.title}</h1>}
          {frontmatter?.description && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground not-prose">
              {frontmatter.description}
            </p>
          )}
          {frontmatter?.image && (
            <div className="relative mb-12 not-prose">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <Image
                  src={frontmatter.image}
                  alt={frontmatter.imageDescription || frontmatter.title || ''}
                  fill
                  sizes="(max-width: 672px) calc(100vw - 48px), 672px"
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

          <Concept />

          {frontmatter?.faq && frontmatter.faq.length > 0 && (
            <div className="mt-16 not-prose">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {frontmatter.faq.map((item: { question: string; answer: string }, index: number) => (
                  <div key={index} className="border-t border-border pt-6 bg-concept-card rounded-lg px-4 pb-4">
                    <h3 className="font-serif text-lg font-normal text-foreground mb-2">
                      {item.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {frontmatter?.tags && frontmatter.tags.length > 0 && (
            <div className="mt-16 not-prose">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4">
                Explore more on these topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                    className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 border border-border rounded-full hover:text-foreground transition-colors hover:border-foreground/30"
                  >
                    {tag}
                  </Link>
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
                      <span className="mt-1 text-sm text-muted-foreground">
                        {post.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return getAllConcepts().map((concept) => ({
    slug: concept.slug,
  }));
}
