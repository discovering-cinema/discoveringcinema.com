import Image from 'next/image';

interface AuthorBioProps {
  lastWatched?: string;
}

export default function AuthorBio({ lastWatched }: AuthorBioProps) {
  return (
    <div className="@container flex flex-col items-start gap-4 font-sans @sm:flex-row">
      <div className="flex gap-4 items-center">
        <Image
          src="/images/authors/christopher-bray.png"
          alt="Christopher Bray"
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 rounded bg-muted object-cover"
        />

        <div>
          <h3 className="mb-1 font-serif text-base font-medium text-foreground">
            Christopher Bray
          </h3>

          <div className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Founder & Engineer
          </div>

          <div className="flex gap-2">
            <a
              href="https://github.com/brayniverse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://twitter.com/brayniverse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.018 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="sr-only">X</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-muted-foreground @sm:max-w-xl">
          Engineering open algorithms to map the invisible connections of
          cinema. I build discovery tools that look beyond streaming catalogs to
          ensure film history isn&apos;t lost to the algorithm.
        </p>

        {lastWatched && (
          <div className="inline-block text-xs border-l border-primary px-3">
            <span className="font-medium">Last Watched:</span>{' '}
            <em className="italic">{lastWatched}</em>
          </div>
        )}
      </div>
    </div>
  );
}
