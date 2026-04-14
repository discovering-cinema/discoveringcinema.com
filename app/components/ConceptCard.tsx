import Link from 'next/link';

interface ConceptCardProps {
  title: string;
  href: string;
  label?: string;
  description?: string;
}

export default function ConceptCard({
  title,
  href,
  label,
  description,
}: ConceptCardProps) {
  return (
    <Link
      href={href}
      className="group block w-full rounded-xl border border-border bg-concept-card p-6 hover:border-foreground/30 transition-colors"
    >
      {label && (
        <small className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3 inline-block">
          {label}
        </small>
      )}
      <h2 className="font-serif text-xl font-normal text-foreground group-hover:text-primary transition-colors">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </Link>
  );
}
