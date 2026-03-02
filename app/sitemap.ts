import {MetadataRoute} from 'next';
import {getAllPosts} from '@/app/lib/posts';

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
  const journalRoutes = getAllPosts().map((post) => {
    return {
      url: `${baseUrl}/journal/${post.slug}`,
      lastModified: post.date || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...routes, ...journalRoutes];
}
