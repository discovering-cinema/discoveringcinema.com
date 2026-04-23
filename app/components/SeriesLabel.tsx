import Link from 'next/link';

interface SeriesLabelProps {
  series: string;
  seriesSlug: string;
}

export default function SeriesLabel({ series, seriesSlug }: SeriesLabelProps) {
  return (
    <Link
      href={`/journal/series/${seriesSlug}`}
      className="relative z-10 bg-background text-accent-foreground py-1 px-2 inline-block hover:bg-accent/30 transition-colors"
    >
      <small>
        <span className="font-bold">Series:</span> <span className="font-medium">{series}</span>
      </small>
    </Link>
  );
}
