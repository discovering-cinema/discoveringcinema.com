interface ArticleSummaryProps {
  description: string;
  variant?: 'default' | 'compact';
}

export default function ArticleSummary({ description, variant = 'default' }: ArticleSummaryProps) {
  const className =
    variant === 'compact'
      ? 'mt-1 text-sm text-muted-foreground'
      : 'relative z-10 mt-2 text-sm text-muted-foreground';
  return <p className={className}>{description}</p>;
}
