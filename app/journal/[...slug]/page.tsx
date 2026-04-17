import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  BlogPosting,
  BreadcrumbList,
  Dataset,
  FAQPage,
  SoftwareApplication,
  WithContext,
} from 'schema-dts';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import AuthorBio from '@/app/components/AuthorBio';
import TableOfContents from '@/app/components/TableOfContents';
import Image from 'next/image';
import JsonLd from '@/app/components/JsonLd';
import Link from 'next/link';
import TagPill from '@/app/components/TagPill';
import ArticleHeader from '@/app/components/ArticleHeader';
import { getAllPosts } from '@/app/lib/posts';
import { readingTime } from '@/app/lib/utils';
import RelatedArticles from '@/app/components/RelatedArticles';
import { SectionLabel } from '@/app/components/SectionLabel';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');
  try {
    const contentDir = path.join(process.cwd(), 'content/articles');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContent);

    const fullTitle = frontmatter?.subtitle
      ? `${frontmatter.title}: ${frontmatter.subtitle}`
      : frontmatter?.title;
    const ogTitle = frontmatter?.opengraph?.title ?? fullTitle;
    const ogDescription = frontmatter?.opengraph?.description ?? frontmatter?.description;
    return {
      title: fullTitle,
      description: frontmatter?.description,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: 'article',
        publishedTime: frontmatter?.date
          ? new Date(frontmatter.date).toISOString()
          : undefined,
        url: `https://discoveringcinema.com/journal/${slug}`,
        ...(frontmatter?.image && {
          images: [{ url: frontmatter.image, alt: frontmatter.imageDescription || ogTitle }],
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        ...(frontmatter?.image && { images: [frontmatter.image] }),
      },
      alternates: {
        canonical: `/journal/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Journal Entry',
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');

  const contentDir = path.join(process.cwd(), 'content/articles');
  const filePath = path.join(contentDir, `${slug}.mdx`);

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

  const { default: Post } = await import(`@/content/articles/${slug}.mdx`);

  // Series logic — derive from posts.ts (series detected via series.yml in directory)
  const currentPost = getAllPosts().find((p) => p.slug === slug);
  let seriesPosts: { title: string; slug: string; current: boolean }[] = [];
  let nextPost: { title: string; slug: string } | null = null;
  const seriesName = currentPost?.series;
  const seriesSlug = currentPost?.seriesSlug;
  if (seriesName && seriesSlug) {
    const allPosts = getAllPosts();
    seriesPosts = allPosts
      .filter((post) => post.seriesSlug === seriesSlug)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((post) => ({
        title: post.subtitle ? `${post.title}: ${post.subtitle}` : post.title,
        slug: post.slug,
        current: post.slug === slug,
      }));

    const currentIndex = seriesPosts.findIndex((post) => post.current);
    if (currentIndex !== -1 && currentIndex < seriesPosts.length - 1) {
      nextPost = seriesPosts[currentIndex + 1];
    }
  }

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
  const dataset: Dataset | null = frontmatter.dataset
    ? {
        '@type': 'Dataset',
        name: frontmatter.dataset.name,
        description: frontmatter.dataset.description,
        creator: {
          '@type': 'Organization',
          name: frontmatter.dataset.creator,
        },
        variableMeasured: frontmatter.dataset.variableMeasured.map(
          (v: { name: string; value: string }) => ({
            '@type': 'PropertyValue',
            name: v.name,
            value: v.value,
          }),
        ),
        distribution: frontmatter.dataset.distribution.map(
          (d: { encodingFormat: string; contentUrl: string }) => ({
            '@type': 'DataDownload',
            encodingFormat: d.encodingFormat,
            contentUrl: d.contentUrl,
          }),
        ),
      }
    : null;
  const softwareApplication: SoftwareApplication | null =
    frontmatter.softwareApplication
      ? {
          '@type': 'SoftwareApplication',
          name: frontmatter.softwareApplication.name,
          operatingSystem: frontmatter.softwareApplication.operatingSystem,
          applicationCategory:
            frontmatter.softwareApplication.applicationCategory,
          description: frontmatter.softwareApplication.description,
          offers: {
            '@type': 'Offer',
            price: frontmatter.softwareApplication.offers.price,
            priceCurrency: frontmatter.softwareApplication.offers.priceCurrency,
          },
          featureList: frontmatter.softwareApplication.featureList,
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
        name: frontmatter.title,
        item: `https://discoveringcinema.com/journal/${slug}`,
      },
    ],
  };

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.subtitle
      ? `${frontmatter.title}: ${frontmatter.subtitle}`
      : frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image,
    datePublished: frontmatter.date
      ? new Date(frontmatter.date).toISOString()
      : undefined,
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
      hasPart: [
        ...(faq ? [faq] : []),
        ...(dataset ? [dataset] : []),
        ...(softwareApplication ? [softwareApplication] : []),
      ],
    },
  };

  return (
    <>
      <div className="py-8">
        <JsonLd data={jsonLd} />

        {/* ── Full-width title and hero ── */}
        {frontmatter?.title && (
          <ArticleHeader
            title={frontmatter.title}
            subtitle={frontmatter.subtitle}
            author="Christopher Bray"
            date={frontmatter.date}
            readingTime={readingTime(fileContent)}
          />
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
                    {seriesPosts.map((post, index) => (
                      <li
                        key={post.slug}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="text-muted-foreground font-mono mt-0.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {post.current ? (
                          <span className="font-medium text-primary">
                            {post.title}
                          </span>
                        ) : (
                          <Link
                            href={`/journal/${post.slug}`}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            )}

            <Post />

            {nextPost && (
              <div className="mt-12 pl-6 border-l-2 border-primary not-prose">
                <SectionLabel as="h3" className="mb-2">Next in series</SectionLabel>
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
          <aside
            className="hidden lg:block"
            aria-label="Sidebar"
          >
            <div className="sticky top-8">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <AuthorBio lastWatched={frontmatter?.lastWatched} />
          </div>
          {frontmatter?.tags && frontmatter.tags.length > 0 && (
            <aside className="mt-8 lg:mt-0">
              <SectionLabel className="mb-4">Explore more on these topics</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag: string) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </aside>
          )}
        </div>

        {frontmatter?.tags && frontmatter.tags.length > 0 && (
          <div className="mt-16">
            <RelatedArticles
              currentSlug={slug}
              currentTags={frontmatter.tags || []}
            />
          </div>
        )}
      </div>
    </>
  );
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}
