import Image from 'next/image';

interface AuthorBioProps {
  lastWatched?: string;
}

export default function AuthorBio({ lastWatched }: AuthorBioProps) {
  return (
    <div className="flex flex-col items-start gap-6 font-sans sm:flex-row">
      <Image
        src="/images/authors/christopher-bray.png"
        alt="Christopher Bray"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 rounded-full bg-muted object-cover"
      />

      <div className="flex-1">
        <h3 className="mb-1 font-serif text-xl font-normal text-foreground">
          Christopher Bray
        </h3>
        <div className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Founder & Engineer
        </div>

        <p className="mb-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Engineering open algorithms to map the invisible connections of
          cinema. I build discovery tools that look beyond streaming catalogs to
          ensure film history isn&apos;t lost to the algorithm.
        </p>

        {lastWatched && (
          <div className="mb-3 inline-block rounded bg-muted px-2 py-1 text-sm text-foreground">
            <span className="font-medium text-foreground">
              Last Watched:
            </span>{' '}
            <em className="italic">{lastWatched}</em>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          <a
            href="https://github.com/brayniverse"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/brayniverse"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            X / Twitter
          </a>
        </div>
      </div>
    </div>
  );
}
