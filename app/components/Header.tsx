import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-8">
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="text-foreground flex items-baseline space-x-2 uppercase"
        >
            <span className="font-montserrat font-medium tracking-[0.2em] text-sm">Discovering</span>
            <span className="font-playfair font-bold text-2xl">Cinema</span>
        </Link>
        <div className="flex gap-6">
          <Link
            href="/journal"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Journal
          </Link>
          <Link
            href="/concepts"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Concepts
          </Link>
        </div>
      </nav>
    </header>
  );
}
