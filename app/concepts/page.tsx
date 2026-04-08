// @ts-nocheck
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllConcepts } from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'Concepts | Discovering Cinema',
  description: 'Educational explainers on key ideas in film history, theory, and criticism.',
  openGraph: {
    title: 'Concepts | Discovering Cinema',
    description: 'Educational explainers on key ideas in film history, theory, and criticism.',
    type: 'website',
    url: 'https://discoveringcinema.com/concepts',
  },
  alternates: {
    canonical: '/concepts',
  },
};

export default function ConceptsIndex() {
  const concepts = getAllConcepts();

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Concepts | Discovering Cinema',
    description: 'Educational explainers on key ideas in film history, theory, and criticism.',
    url: 'https://discoveringcinema.com/concepts',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: concepts.map((concept, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://discoveringcinema.com/concepts/${concept.slug}`,
        name: concept.title,
      })),
    },
  };

  return (
    <>
      <Header />
      <JsonLd data={jsonLd} />
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-normal tracking-tight text-foreground">
          Concepts
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Film criticism has a vocabulary that rarely gets explained. Terms like the punctum, embodied spectatorship,
          and the indexical image circulate in academic writing and serious criticism without much effort to make them
          accessible to readers who haven't studied film theory formally. These pages try to close that gap. Each one
          introduces a foundational concept, traces it to its source, and shows what it actually looks like when applied
          to a film you might have seen. The goal isn't to make you sound knowledgeable about film theory. It's to give
          you tools that make watching films more rewarding.
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {concepts.map((concept) => (
          <article
            key={concept.slug}
            className="group relative flex flex-col items-start"
          >
            {concept.image && (
              <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
                <Image
                  src={concept.image}
                  alt={concept.title}
                  fill
                  sizes="(max-width: 672px) calc(100vw - 48px), 672px"
                  className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
              </div>
            )}
            <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
              <Link href={`/concepts/${concept.slug}`}>
                <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                <span className="relative z-10">{concept.title}</span>
              </Link>
            </h2>
            {concept.description && (
              <p className="relative z-10 mt-2 text-sm text-muted-foreground">
                {concept.description}
              </p>
            )}
            <div
              aria-hidden="true"
              className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary"
            >
              Read explainer
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="ml-1 h-4 w-4 stroke-current transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M6.75 5.75 9.25 8l-2.5 2.25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
