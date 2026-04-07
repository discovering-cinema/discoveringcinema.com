import {MetadataRoute} from 'next';
import {getAllPosts, getAllEducationalContent, getAllTags, getAllSeries} from '@/app/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://discoveringcinema.com';

  // Static routes
  const routes = ['', '/manifesto', '/journal', '/concepts', '/journal/series'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic journal routes
  const journalRoutes = getAllPosts().map((post) => {
    return {
      url: `${baseUrl}/journal/${post.slug}`,
      lastModified: post.date || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  const conceptRoutes = getAllEducationalContent().map((item) => ({
    url: `${baseUrl}${item.urlPath}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const tagRoutes = getAllTags().map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const seriesRoutes = getAllSeries().map((s) => ({
    url: `${baseUrl}/journal/series/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...journalRoutes, ...conceptRoutes, ...tagRoutes, ...seriesRoutes];
}
