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

export function getAllPosts(): Post[] {
  const contentDir = path.join(process.cwd(), 'content');
  const files = getFilesRecursively(contentDir);

  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const relativePath = path.relative(contentDir, file);
      const slug = relativePath.replace(/\\/g, '/').replace(/\.mdx$/, '');
      const fileContent = fs.readFileSync(file, 'utf8');
      const { data: frontmatter } = matter(fileContent);

      return {
        slug,
        title: frontmatter.title || slug.split('/').pop() || '',
        date: frontmatter.date ? new Date(frontmatter.date) : null,
        description: frontmatter.description || '',
        tags: frontmatter.tags || [],
        image: frontmatter.image || '',
        series: frontmatter.series,
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
