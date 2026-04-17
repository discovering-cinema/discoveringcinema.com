import { getAllPosts } from '@/app/lib/posts';
import RelatedArticlesCarousel from '@/app/components/RelatedArticlesCarousel';

interface RelatedArticlesProps {
  currentSlug: string;
  currentTags: string[];
}

export default function RelatedArticles({
  currentSlug,
  currentTags,
}: RelatedArticlesProps) {
  if (!currentTags.length) return null;

  const lowerTags = currentTags.map((t) => t.toLowerCase());

  const related = getAllPosts()
    .filter((post) => post.slug.toLowerCase().trim() !== currentSlug.toLowerCase().trim())
    .map((post) => ({
      post,
      sharedCount: post.tags.filter((t) => lowerTags.includes(t.toLowerCase()))
        .length,
    }))
    .filter(({ sharedCount }) => sharedCount > 0)
    .sort((a, b) => {
      if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
      return (b.post.date?.getTime() ?? 0) - (a.post.date?.getTime() ?? 0);
    })
    .slice(0, 3)
    .map(({ post }) => post);

  if (!related.length) return null;

  return <RelatedArticlesCarousel related={related} />;
}
