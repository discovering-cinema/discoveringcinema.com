interface ArticleDateProps {
  date: Date | string;
  variant?: 'default' | 'compact' | 'plain';
}

export default function ArticleDate({
  date,
  variant = 'default',
}: ArticleDateProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'plain') {
    return (
      <time
        className="text-sm text-muted-foreground"
        dateTime={d.toISOString()}
      >
        {formatted}
      </time>
    );
  }

  const isCompact = variant === 'compact';
  return (
    <time
      className={`relative z-10 flex items-center text-muted-foreground pl-3.5 ${isCompact ? 'text-xs mb-2' : 'text-sm my-3'}`}
      dateTime={d.toISOString()}
    >
      <span
        className="absolute inset-y-0 left-0 flex items-center"
        aria-hidden="true"
      >
        <span
          className={`rounded-full bg-border w-0.5 ${isCompact ? 'h-3' : 'h-4'}`}
        />
      </span>
      {formatted}
    </time>
  );
}
