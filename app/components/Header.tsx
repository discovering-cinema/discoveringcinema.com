import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-8">
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Discovering Cinema
        </Link>
        <div className="flex gap-6">
          <Link
            href="/journal"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Journal
          </Link>
          <Link
            href="/manifesto"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Manifesto
          </Link>
        </div>
      </nav>
    </header>
  );
}
