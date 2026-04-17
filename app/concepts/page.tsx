import ConceptCard from '@/app/components/ConceptCard';
import JsonLd from '@/app/components/JsonLd';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';
import { CollectionPage, WithContext } from 'schema-dts';
import { Metadata } from 'next';
import { getAllConcepts } from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'Film Concepts: Key Ideas in Film History and Theory',
  description:
    'Clear explainers on the ideas that film critics, historians, and theorists use to understand cinema — and what they reveal when applied.',
  openGraph: {
    title: 'Film Concepts: Key Ideas in Film History and Theory',
    description:
      'Clear explainers on the ideas that film critics, historians, and theorists use to understand cinema — and what they reveal when applied.',
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
    description:
      'Educational explainers on key ideas in film history, theory, and criticism.',
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
      <JsonLd data={jsonLd} />
      <header className="mb-16 text-center">
        <TitleLockup>
          <Title>Concepts</Title>
          <Subtitle>Key ideas in film theory, made accessible.</Subtitle>
        </TitleLockup>
        <p className="mt-8 max-w-2xl mx-auto text-center text-muted-foreground leading-relaxed">
          Film criticism has a vocabulary that rarely gets explained. Terms like
          the punctum, embodied spectatorship, and the indexical image circulate
          in academic writing and serious criticism without much effort to make
          them accessible to readers who haven&apos;t studied film theory
          formally. These pages try to close that gap. Each one introduces a
          foundational concept, traces it to its source, and shows what it
          actually looks like when applied to a film you might have seen. The
          goal isn&apos;t to make you sound knowledgeable about film theory.
          It&apos;s to give you tools that make watching films more rewarding.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            label="Concept"
            title={concept.title}
            description={concept.description}
          />
        ))}
      </div>
    </>
  );
}
