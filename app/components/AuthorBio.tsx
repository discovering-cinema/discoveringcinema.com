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
        className="h-16 w-16 flex-shrink-0 rounded bg-zinc-100 object-cover dark:bg-zinc-800"
      />

      <div className="flex-1">
        <h3 className="mb-1 font-serif text-xl font-normal text-zinc-900 dark:text-zinc-100">
          Christopher Bray
        </h3>
        <div className="mb-3 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          Founder & Engineer
        </div>

        <p className="mb-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Engineering open algorithms to map the invisible connections of
          cinema. I build discovery tools that look beyond streaming catalogs to
          ensure film history isn&apos;t lost to the algorithm.
        </p>

        {lastWatched && (
          <div className="mb-3 inline-block rounded bg-zinc-100 px-2 py-1 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Last Watched:
            </span>{' '}
            <em className="italic">{lastWatched}</em>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          <a
            href="https://github.com/brayniverse"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/brayniverse"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            X / Twitter
          </a>
        </div>
      </div>
    </div>
  );
}
