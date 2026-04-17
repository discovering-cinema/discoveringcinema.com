interface BylineProps {
  author: string;
  date: Date | string;
  readingTime: number;
  centered?: boolean;
}

export default function Byline({ author, date, readingTime, centered }: BylineProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="font-sans">
      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1${centered ? ' justify-center' : ''}`}>
        <span className="text-sm font-medium text-foreground">By {author}</span>
        <span className="text-muted-foreground/40" aria-hidden="true">·</span>
        <time className="text-sm text-muted-foreground" dateTime={d.toISOString()}>
          {formatted}
        </time>
        <span className="text-muted-foreground/40" aria-hidden="true">·</span>
        <span className="text-sm text-muted-foreground">{readingTime} min read</span>
      </div>
    </div>
  );
}
