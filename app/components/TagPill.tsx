import Link from 'next/link';

interface TagPillProps {
  tag: string;
}

export default function TagPill({ tag }: TagPillProps) {
  return (
    <Link href={`/tags/${encodeURIComponent(tag.toLowerCase())}`} className="font-mono uppercase tracking-wider text-muted-foreground px-2 py-0.5 text-xs border border-border hover:text-foreground transition-colors hover:border-foreground/30">
      {tag}
    </Link>
  );
}
