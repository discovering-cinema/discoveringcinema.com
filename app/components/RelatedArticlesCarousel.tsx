import ArticlePreview from '@/app/components/ArticlePreview';
import type { Post } from '@/app/lib/posts';
import { SectionLabel } from '@/app/components/SectionLabel';

interface RelatedArticlesCarouselProps {
  related: Post[];
}

export default function RelatedArticlesCarousel({ related }: RelatedArticlesCarouselProps) {
  return (
    <div>
      <SectionLabel className="mb-6">Related reading</SectionLabel>
      <div className="@container">
        <div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-8">
          {related.map((article, i) => (
            <div
              key={article.slug}
              className={i === 0 ? '' : i === 1 ? 'hidden @md:block' : 'hidden @2xl:block'}
            >
              <ArticlePreview
                title={article.title}
                subtitle={article.subtitle}
                slug={article.slug}
                date={article.date}
                description={article.description}
                image={article.image}
                series={article.series}
                seriesSlug={article.seriesSlug}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
