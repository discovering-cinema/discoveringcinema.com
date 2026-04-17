import Link from 'next/link';
import { tagToSlug } from '@/app/lib/posts';

interface TagPillProps {
  tag: string;
}

export default function TagPill({ tag }: TagPillProps) {
  return (
    <Link
      href={`/tags/${tagToSlug(tag)}`}
      className="font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 text-xs border border-border hover:text-foreground transition-colors hover:border-foreground/30"
    >
      {tag}
    </Link>
  );
}
