import { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllPosts,
  getAllEducationalContent,
  getAllTags,
  getTagDisplayName,
  tagToSlug,
} from '@/app/lib/posts';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';

export const metadata: Metadata = {
  title: 'Tags | Discovering Cinema',
  description: 'Browse all topics and themes across Discovering Cinema.',
  alternates: {
    canonical: '/tags',
  },
};

export default function TagsPage() {
  const allPosts = getAllPosts();
  const allEducationalContent = getAllEducationalContent();
  const tags = getAllTags();

  const tagsWithItems = tags
    .map((tagSlug) => {
      const displayName = getTagDisplayName(tagSlug);
      
      const postsWithTag = allPosts.filter((post) =>
        post.tags.some((t) => tagToSlug(t) === tagSlug)
      );
      
      const educationalWithTag = allEducationalContent.filter((item) =>
        item.tags.some((t) => tagToSlug(t) === tagSlug)
      ).map(item => ({
        ...item,
        date: null as Date | null, // Educational items don't have dates in the current schema
      }));

      // Combine and sort by date if available, then take latest 3
      const allItems: (typeof postsWithTag[0] | typeof educationalWithTag[0])[] = 
        [...postsWithTag, ...educationalWithTag].sort((a, b) => {
          if (a.date && b.date) {
            return b.date.getTime() - a.date.getTime();
          }
          if (a.date) return -1;
          if (b.date) return 1;
          return 0;
        }).slice(0, 3);

      return {
        slug: tagSlug,
        displayName,
        items: allItems,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <>
      <header className="mb-16 text-center">
        <TitleLockup>
          <Title>Tags</Title>
          <Subtitle>
            Explore cinema through topics, themes, and creative families.
          </Subtitle>
        </TitleLockup>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {tagsWithItems.map((tag) => (
          <div key={tag.slug} className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl border-b border-border pb-2">
              <Link href={`/tags/${tag.slug}`} className="hover:text-muted-foreground transition-colors">
                {tag.displayName}
              </Link>
            </h2>
            <ul className="flex flex-col gap-3">
              {tag.items.map((item) => {
                const isEducational = 'urlPath' in item;
                return (
                  <li key={isEducational ? item.urlPath : item.slug}>
                    <Link 
                      href={isEducational ? item.urlPath : `/journal/${item.slug}`}
                      className="group"
                    >
                      <span className="text-sm font-medium leading-snug group-hover:text-muted-foreground transition-colors line-clamp-2">
                        {item.title}
                      </span>
                      {'date' in item && item.date && (
                        <span className="block text-xs text-muted-foreground mt-1">
                          {new Date(item.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {tag.items.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No items found.</p>
            )}
            <Link 
                href={`/tags/${tag.slug}`}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
                View all &rarr;
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
