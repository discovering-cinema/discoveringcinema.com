import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://discoveringcinema.com';

  // Static routes
  const routes = ['', '/manifesto', '/journal'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic journal routes
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);

  const journalRoutes = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);
      const slug = file.replace(/\.mdx$/, '');

      return {
        url: `${baseUrl}/journal/${slug}`,
        lastModified: frontmatter.date
          ? new Date(frontmatter.date)
          : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });

  return [...routes, ...journalRoutes];
}
