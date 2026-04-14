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
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded bg-muted object-cover"
        />

        <div>
          <h3 className="mb-1 font-serif text-base font-normal text-muted-foreground">
            Christopher Bray
          </h3>

          <div className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Founder & Engineer
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <p className="text-xs leading-relaxed text-muted-foreground @sm:max-w-xl">
          Engineering open algorithms to map the invisible connections of
          cinema. I build discovery tools that look beyond streaming catalogs to
          ensure film history isn&apos;t lost to the algorithm.
        </p>

        {lastWatched && (
          <div className="mb-3 inline-block text-xs border-l border-primary px-2.5">
            <span className="font-medium">
              Last Watched:
            </span>{' '}
            <em className="italic">{lastWatched}</em>
          </div>
        )}

        <div className="flex gap-4 text-xs">
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
