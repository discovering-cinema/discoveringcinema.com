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
      className="group block w-full rounded-xl bg-concept-card border border-border/60 border-t-2 border-t-accent shadow-sm p-6 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
    >
      {label && (
        <small className="font-mono text-[10px] uppercase tracking-wider text-concept-card-label mb-3 inline-block">
          {label}
        </small>
      )}
      <h2 className="font-serif text-xl font-normal text-concept-card-foreground group-hover:text-primary transition-colors">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-concept-card-muted">{description}</p>
      )}
    </Link>
  );
}
