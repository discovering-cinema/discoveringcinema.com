import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-2xl px-6 py-12">
      <div className="border-t border-border pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Discovering Cinema. All rights
          reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link
            href="/manifesto"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Manifesto
          </Link>
          <Link
            href="/journal"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Journal
          </Link>
          <Link
            href="/rss.xml"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            RSS
          </Link>
          <a
            href="https://github.com/discovering-cinema"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/_discovercinema"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
