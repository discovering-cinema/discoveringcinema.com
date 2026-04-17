import Link from 'next/link';
import { getAllPosts, getAllConcepts } from '@/app/lib/posts';
import { SectionLabel } from '@/app/components/SectionLabel';

export default function Footer() {
  const recentPosts = getAllPosts().slice(0, 4);
  const concepts = getAllConcepts();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-col gap-8 md:grid-cols-3">
          <div>
            <SectionLabel as="h3" accent="primary" className="mb-3">Journal</SectionLabel>
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {post.title}{post.subtitle && (': ' + post.subtitle)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/journal"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  All entries →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <SectionLabel as="h3" accent="accent" className="mb-3">Concepts</SectionLabel>
            <ul className="space-y-2">
              {concepts.map((concept) => (
                <li key={concept.slug}>
                  <Link
                    href={concept.urlPath}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {concept.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/concepts"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  All concepts →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <SectionLabel as="h3" className="mb-3">Reference</SectionLabel>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/manifesto"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Manifesto
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tags
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Discovering Cinema. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/rss.xml"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              <span className="sr-only">RSS</span>
            </Link>
            <a
              href="https://github.com/discovering-cinema"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com/_discovercinema"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.018 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="sr-only">X</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
