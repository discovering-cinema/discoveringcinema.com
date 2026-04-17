interface ArticleSummaryProps {
  description: string;
}

export default function ArticleSummary({ description }: ArticleSummaryProps) {
  return (
    <p className="relative z-10 mt-3 text-sm text-muted-foreground">
      {description}
    </p>
  );
}
