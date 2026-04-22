import { allPosts, allConcepts, allSeries } from 'content-collections';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  subtitle?: string;
  date: Date | null;
  description: string;
  tags: string[];
  image: string;
  series?: string;
  seriesSlug?: string;
  order?: number;
  opengraph?: {
    title?: string;
    description?: string;
  };
  faq?: { question: string; answer: string }[];
  dataset?: {
    name: string;
    description: string;
    creator: string;
    variableMeasured?: { name: string; value: string }[];
    distribution?: { encodingFormat: string; contentUrl: string }[];
  };
}

export function getAllPosts(): Post[] {
  return allPosts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle,
      date: post.date ? new Date(post.date) : null,
      description: post.description,
      tags: post.tags,
      image: post.image || '',
      series: allSeries.find((s) => s.slug === post.seriesSlug)?.title || post.series,
      seriesSlug: post.seriesSlug,
      order: post.order,
      opengraph: post.opengraph,
      faq: post.faq,
      dataset: post.dataset,
    }))
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    });
}

export function getAllSeries(): {
  title: string;
  subtitle?: string;
  description: string;
  opengraph?: { title?: string; description?: string };
  slug: string;
  posts: Post[];
}[] {
  const posts = getAllPosts();
  return allSeries.map((series) => ({
    title: series.title,
    subtitle: series.subtitle,
    description: series.description,
    opengraph: series.opengraph,
    slug: series.slug,
    posts: posts
      .filter((p) => p.seriesSlug === series.slug)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  }));
}

export interface EducationalContent {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  urlPath: string;
  contentType: string;
  opengraph?: {
    title?: string;
    description?: string;
  };
}

export interface Concept extends EducationalContent {
  faq?: { question: string; answer: string }[];
  relatedArticles: string[];
}

export function getAllConcepts(): Concept[] {
  return allConcepts.map((concept) => ({
    slug: concept.slug,
    title: concept.title,
    description: concept.description,
    image: concept.image,
    tags: concept.tags,
    urlPath: `/concepts/${concept.slug}`,
    contentType: 'concept',
    opengraph: concept.opengraph,
    faq: concept.faq,
    relatedArticles: concept.relatedArticles,
  }));
}

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getTagDisplayName(slug: string): string {
  const filePath = path.join(process.cwd(), 'content/tags.yaml');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(`---\n${raw}\n---`);
    const key = Object.keys(data).find((k) => tagToSlug(k) === slug);
    if (key) return key;
  }
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getTagSummary(slug: string): string | null {
  const filePath = path.join(process.cwd(), 'content/tags.yaml');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(`---\n${raw}\n---`);
  const key = Object.keys(data).find((k) => tagToSlug(k) === slug);
  return key ? (data[key] as string).trim() : null;
}

export function getAllTags(): string[] {
  const postTags = getAllPosts().flatMap((p) => p.tags);
  const educationalTags = getAllEducationalContent().flatMap((e) => e.tags);
  return [...new Set([...postTags, ...educationalTags].map(tagToSlug))];
}

export function getAllEducationalContent(): EducationalContent[] {
  return [
    ...getAllConcepts(),
    // Register new educational content types here, e.g.:
    // ...getAllGuides(),
  ];
}

