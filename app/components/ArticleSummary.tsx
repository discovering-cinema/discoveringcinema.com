interface ArticleSummaryProps {
  description: string;
  className?: string;
}

export default function ArticleSummary({ description, className }: ArticleSummaryProps) {
  return (
    <p className={`relative z-10 mt-3 text-muted-foreground ${className ?? 'text-sm'}`}>
      {description}
    </p>
  );
}
