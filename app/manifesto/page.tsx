import { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { TitleLockup } from '@/app/components/TitleLockup';
import { Title } from '@/app/components/Title';
import { Subtitle } from '@/app/components/Subtitle';
import { WebPage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'The Manifesto: Our Editorial Principles',
  description:
    'The editorial principles behind Discovering Cinema: accessible film history, credit for the whole crew, and cinema treated as a public record worth preserving.',
  openGraph: {
    title: 'The Manifesto: Our Editorial Principles | Discovering Cinema',
    description:
      'The editorial principles behind Discovering Cinema: accessible film history, credit for the whole crew, and cinema treated as a public record worth preserving.',
    type: 'website',
    url: 'https://discoveringcinema.com/manifesto',
    images: [
      {
        url: '/api/og?title=The Manifesto&subtitle=The editorial principles behind Discovering Cinema.&label=About',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og?title=The Manifesto&subtitle=The editorial principles behind Discovering Cinema.&label=About'],
  },
  alternates: {
    canonical: '/manifesto',
  },
};

export default function ManifestoPage() {
  const tenets = [
    {
      number: '01',
      title: 'Cinema is a Public Utility',
      content:
        'The history of film — who made what, when, with whom, and why it matters — belongs to the public. We pledge to keep our writing free to read and free of gatekeeping. Where an idea comes from academic film theory, we trace it to its source and explain it in plain language, because understanding cinema should not require a degree.',
    },
    {
      number: '02',
      title: 'Discovery over Retention',
      content:
        'Modern platforms are designed to keep you watching; modern publishing is designed to keep you scrolling. We do neither. Every essay is written to send you somewhere — to a film, a library, a cinema, a book. We optimise for curiosity, not time on site. We build compasses, not GPS directions.',
    },
    {
      number: '03',
      title: 'The Crew is the Auteur',
      content:
        'Filmmaking is a collaborative act. We reject the Great Man Theory that attributes a film solely to its director. When we write about how films are made, we name the editor, the sound designer, the gaffer — and treat their choices with the same seriousness criticism usually reserves for the cast.',
    },
    {
      number: '04',
      title: 'Against the Memory Hole',
      content:
        'Availability is not a measure of quality. We write about films regardless of their streaming status, and we always tell you where to find them — libraries, physical media, archives — so the dark matter of cinema is not forgotten. What the platforms delete, the record should keep.',
    },
    {
      number: '05',
      title: 'The Reader is not the Product',
      content:
        'We do not run ads, track your behaviour, or build shadow profiles. Your taste is your own. We collect nothing beyond what is strictly necessary to publish.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'The Manifesto | Discovering Cinema',
    description:
      'The guiding principles that shape our code, our design, and our data.',
    url: 'https://discoveringcinema.com/manifesto',
  } satisfies WithContext<WebPage>;

  return (
    <>
      <div className="py-12">
        <JsonLd data={jsonLd} />
        <header className="mb-16">
          <TitleLockup>
            <Title>The Manifesto</Title>
            <Subtitle className="mt-8">
              We are building Discovering Cinema to be the counter-balance to
              the streaming era. These are the promises that guide our code, our
              design, and our data.
            </Subtitle>
          </TitleLockup>
          <div className="mt-12 h-px w-full bg-border" />
        </header>

        <main className="space-y-16">
          {tenets.map((tenet) => (
            <section key={tenet.number} className="group">
              <span className="block font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {tenet.number}
              </span>
              <h2 className="mt-2 font-serif text-2xl text-foreground">
                {tenet.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {tenet.content}
              </p>
            </section>
          ))}

          <section className="rounded-lg border border-border bg-muted/50 p-8">
            <h2 className="font-serif text-xl text-foreground">
              What We Are Not
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                'We are not a review aggregator.',
                'We are not a news desk chasing the release calendar.',
                'We are not an academic journal.',
                'We are not a "content" platform.',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 text-muted-foreground"
                >
                  <span className="text-xl font-bold text-muted-foreground/70">
                    ×
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}
