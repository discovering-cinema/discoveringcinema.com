import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPosting, FAQPage, Dataset, SoftwareApplication, BreadcrumbList, WithContext } from 'schema-dts';
import matter from 'gray-matter';
import AuthorBio from '@/app/components/AuthorBio';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import Link from 'next/link';
import { getAllPosts } from '@/app/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray.join('/');
  try {
    const contentDir = path.join(process.cwd(), 'content');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContent);

    return {
      title: frontmatter?.title,
      description: frontmatter?.description,
      openGraph: {
        title: frontmatter?.title,
        description: frontmatter?.description,
        type: 'article',
        publishedTime: frontmatter?.date
          ? new Date(frontmatter.date).toISOString()
          : undefined,
        url: `https://discoveringcinema.com/journal/${slug}`,
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

  const contentDir = path.join(process.cwd(), 'content');
  const filePath = path.join(contentDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter } = matter(fileContent);

  const { default: Post } = await import(`@/content/${slug}.mdx`);

  // Series logic
  let seriesPosts: { title: string; slug: string; current: boolean }[] = [];
  let nextPost: { title: string; slug: string } | null = null;
  if (frontmatter.series) {
    const seriesName = frontmatter.series;
    const allPosts = getAllPosts();
    seriesPosts = allPosts
      .filter((post) => post.series === seriesName)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((post) => ({
        title: post.title,
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
  const softwareApplication: SoftwareApplication | null = frontmatter.softwareApplication
    ? {
        '@type': 'SoftwareApplication',
        name: frontmatter.softwareApplication.name,
        operatingSystem: frontmatter.softwareApplication.operatingSystem,
        applicationCategory: frontmatter.softwareApplication.applicationCategory,
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
        name: part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
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
    headline: frontmatter.title,
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
      <Header />
      <div className="py-8">
        <JsonLd data={jsonLd} />
        <article className="prose max-w-none prose-zinc dark:prose-invert prose-h1:font-serif prose-h1:font-normal prose-h1:tracking-tight prose-h2:font-serif prose-h2:font-normal prose-h3:font-serif prose-h3:font-normal prose-h4:font-serif prose-h4:font-normal">
          {frontmatter?.series && (
            <small className="bg-teal-50 py-1 px-2 rounded text-teal-600 dark:text-teal-400 mb-4 inline-block">
              Series: <span className="font-medium">{frontmatter.series}</span>
            </small>
          )}
          {frontmatter?.title && <h1>{frontmatter.title}</h1>}
          {frontmatter?.date && (
            <div className="flex items-center justify-between mb-8">
              <time className="text-sm text-zinc-600 dark:text-zinc-400">
                {new Date(frontmatter.date).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}
          {frontmatter?.image && (
            <div className="relative mb-12 not-prose">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
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
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                  {frontmatter.imageDescription}
                </p>
              )}
            </div>
          )}

          {seriesPosts.length > 0 && (
            <div className="mb-12 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 not-prose">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4">
                In this series: {frontmatter.series}
              </h2>
              <nav>
                <ol className="space-y-3">
                  {seriesPosts.map((post, index) => (
                    <li
                      key={post.slug}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {post.current ? (
                        <span className="font-medium text-teal-600 dark:text-teal-400">
                          {post.title} (current)
                        </span>
                      ) : (
                        <Link
                          href={`/journal/${post.slug}`}
                          className="text-zinc-600 dark:text-zinc-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
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
          {frontmatter?.tags && frontmatter.tags.length > 0 && (
            <div className="mt-16 not-prose">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4">
                Explore more on these topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/journal/tag/${encodeURIComponent(tag.toLowerCase())}`}
                    className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-full hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {nextPost && (
            <div className="mt-12 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 not-prose">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                Next in series
              </h3>
              <Link
                href={`/journal/${nextPost.slug}`}
                className="group flex items-center justify-between gap-4"
              >
                <span className="text-xl font-serif text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {nextPost.title}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <AuthorBio lastWatched={frontmatter?.lastWatched} />
          </div>
        </article>
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
