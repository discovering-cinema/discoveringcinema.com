import { generateOGImage } from '@/app/lib/og';
import { allPosts, allConcepts, allSeries } from 'content-collections';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');
    const tag = searchParams.get('tag');

    if (type === 'post' && slug) {
      const post = allPosts.find((p) => p.slug === slug);
      if (post) {
        return await generateOGImage({
          title: post.title,
          subtitle: post.subtitle || post.description,
          label: 'Journal Article',
          image: post.image,
        });
      }
    }

    if (type === 'concept' && slug) {
      const concept = allConcepts.find((c) => c.slug === slug);
      if (concept) {
        return await generateOGImage({
          title: concept.title,
          subtitle:
            concept.subtitle ||
            concept.opengraph?.description ||
            concept.description,
          label: 'Film Concept',
          image: concept.image,
        });
      }
    }

    if (type === 'series' && slug) {
      const series = allSeries.find((s) => s.slug === slug);
      if (series) {
        return await generateOGImage({
          title: series.title,
          subtitle: series.subtitle || series.description,
          label: 'Journal Series',
        });
      }
    }

    if (type === 'tag' && tag) {
      // For global tags
      return await generateOGImage({
        title: tag
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        subtitle: `Everything we've written about ${tag.replace(/-/g, ' ')}.`,
        label: 'Tag',
      });
    }

    if (type === 'journal-tag' && tag) {
      return await generateOGImage({
        title: tag
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        subtitle: `Journal articles tagged with "${tag.replace(/-/g, ' ')}".`,
        label: 'Journal Tag',
      });
    }

    if (type === 'timeline' && slug) {
      // For individual timeline topics
      return await generateOGImage({
        title: slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        subtitle: 'Tracing the evolution of British cinema.',
        label: 'Timeline Topic',
      });
    }

    // Default/Home or unknown
    const title = searchParams.get('title') || 'Discovering Cinema';
    const subtitle =
      searchParams.get('subtitle') ||
      'A journey through the history, theory, and future of British film.';
    const label = searchParams.get('label') || undefined;

    return await generateOGImage({
      title,
      subtitle,
      label,
    });
  } catch (e: unknown) {
    const error = e as Error;
    console.error(error.message);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
