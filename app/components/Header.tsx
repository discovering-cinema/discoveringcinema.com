import Link from 'next/link';
import MobileMenuButton from '@/app/components/MobileMenuButton';

export default function Header() {
  return (
    <header className="relative py-8 border-b border-border mb-12">
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="text-foreground flex flex-col sm:flex-row items-baseline space-x-2 uppercase"
        >
            <span className="font-montserrat font-medium tracking-[0.2em] text-sm">Discovering</span>
            <span className="font-playfair font-bold text-2xl">Cinema</span>
        </Link>
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
      </nav>
    </header>
  );
}
