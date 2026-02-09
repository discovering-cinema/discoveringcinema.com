import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-2xl px-6 py-12">
      <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Discovering Cinema. All rights
          reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link
            href="/manifesto"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Manifesto
          </Link>
          <Link
            href="/journal"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Journal
          </Link>
          <Link
            href="/rss.xml"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            RSS
          </Link>
          <a
            href="https://github.com/discovering-cinema"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/_discovercinema"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
