import Link from 'next/link';
import MobileMenuButton from '@/app/components/MobileMenuButton';

export default function Header() {
  return (
    <header className="relative py-4 border-b border-border mb-12">
      <nav className="mx-auto max-w-5xl px-6 grid grid-cols-3 items-center">
        <div />
        <Link
          href="/"
          className="text-foreground flex flex-col items-center justify-center uppercase leading-none"
        >
          <span className="font-montserrat font-medium tracking-[0.2em] text-sm">
            Discovering
          </span>
          <span className="font-playfair font-bold text-3xl tracking-[0.1em]">Cinema</span>
        </Link>
        <div className="flex items-center justify-end gap-6">
          <div className="hidden sm:flex gap-6">
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
          <MobileMenuButton />
        </div>
      </nav>
    </header>
  );
}
