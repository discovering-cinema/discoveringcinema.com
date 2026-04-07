import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: Date | null;
  description: string;
  tags: string[];
  image: string;
  series?: string;
  seriesSlug?: string;
  order?: number;
  faq?: { question: string; answer: string }[];
  dataset?: {
    name: string;
    description: string;
    creator: string;
    variableMeasured: { name: string; value: string }[];
    distribution: { encodingFormat: string; contentUrl: string }[];
  };
  softwareApplication?: {
    name: string;
    operatingSystem: string;
    applicationCategory: string;
    description: string;
    offers: {
      price: string;
      priceCurrency: string;
    };
    featureList: string[];
  };
}

function readSeriesYml(dir: string): { name: string; description: string } | null {
  const filePath = path.join(dir, 'series.yml');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(`---\n${raw}\n---`);
  if (!data.name) return null;
  return {
    name: data.name as string,
    description: (data.description as string | undefined)?.trim() ?? '',
  };
}

export function getAllPosts(): Post[] {
  const contentDir = path.join(process.cwd(), 'content/articles');
  if (!fs.existsSync(contentDir)) return [];
  const files = getFilesRecursively(contentDir);

  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const relativePath = path.relative(contentDir, file);
      const slug = relativePath.replace(/\\/g, '/').replace(/\.mdx$/, '');
      const fileContent = fs.readFileSync(file, 'utf8');
      const { data: frontmatter } = matter(fileContent);

      const parentDir = path.dirname(file);
      const seriesData = parentDir !== contentDir ? readSeriesYml(parentDir) : null;
      const seriesSlug = seriesData ? path.basename(parentDir) : undefined;

      return {
        slug,
        title: frontmatter.title || slug.split('/').pop() || '',
        date: frontmatter.date ? new Date(frontmatter.date) : null,
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
        image: frontmatter.image || '',
        series: seriesData?.name ?? frontmatter.series,
        seriesSlug,
        order: frontmatter.order,
        faq: frontmatter.faq,
        dataset: frontmatter.dataset,
        softwareApplication: frontmatter.softwareApplication,
      };
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    });
}

export function getAllSeries(): { name: string; description: string; slug: string; posts: Post[] }[] {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  if (!fs.existsSync(articlesDir)) return [];
  const dirs = fs.readdirSync(articlesDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  const allPosts = getAllPosts();
  return dirs
    .map((d) => {
      const yml = readSeriesYml(path.join(articlesDir, d.name));
      if (!yml) return null;
      const posts = allPosts
        .filter((p) => p.seriesSlug === d.name)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return { ...yml, slug: d.name, posts };
    })
    .filter((s): s is { name: string; description: string; slug: string; posts: Post[] } => s !== null);
}

export interface EducationalContent {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  urlPath: string;
  contentType: string;
}

export interface Concept extends EducationalContent {
  faq?: { question: string; answer: string }[];
  relatedArticles: string[];
}

export function getAllConcepts(): Concept[] {
  const conceptsDir = path.join(process.cwd(), 'content/concepts');
  if (!fs.existsSync(conceptsDir)) return [];
  return getFilesRecursively(conceptsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = path.basename(file, '.mdx');
      const { data } = matter(fs.readFileSync(file, 'utf8'));
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        image: data.image,
        tags: data.tags || [],
        urlPath: `/concepts/${slug}`,
        contentType: 'concept',
        faq: data.faq,
        relatedArticles: data.relatedArticles || [],
      };
    });
}

export function getTagSummary(tag: string): string | null {
  const filePath = path.join(process.cwd(), 'content/tags.yaml');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(`---\n${raw}\n---`);
  const key = Object.keys(data).find((k) => k.toLowerCase() === tag.toLowerCase());
  return key ? (data[key] as string).trim() : null;
}

export function getAllTags(): string[] {
  const postTags = getAllPosts().flatMap((p) => p.tags);
  const educationalTags = getAllEducationalContent().flatMap((e) => e.tags);
  return [...new Set([...postTags, ...educationalTags].map((t) => t.toLowerCase()))];
}

export function getAllEducationalContent(): EducationalContent[] {
  return [
    ...getAllConcepts(),
    // Register new educational content types here, e.g.:
    // ...getAllGuides(),
  ];
}

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
