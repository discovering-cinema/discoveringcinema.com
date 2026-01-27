import { Metadata } from 'next';
import Header from '@/app/components/Header';
import JsonLd from '@/app/components/JsonLd';
import { WebPage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'The Manifesto | Discovering Cinema',
  description:
    'The guiding principles that shape our code, our design, and our data.',
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
        'The history of film - who made what, when, and with whom - belongs to the public domain. We pledge to keep our data open, accessible via the Open Cinema Index, and free from the walled gardens of proprietary APIs.',
    },
    {
      number: '02',
      title: 'Discovery over Retention',
      content:
        'Modern algorithms are designed to keep you watching. Ours are designed to help you explore. We optimize for curiosity, not "Time on Site." We build compasses, not GPS directions.',
    },
    {
      number: '03',
      title: 'The Crew is the Auteur',
      content:
        'Filmmaking is a collaborative act. We reject the "Great Man Theory" that attributes a film solely to its Director. We promise to elevate the Editor, the Sound Designer, and the Gaffer with the same respect usually reserved for the Cast.',
    },
    {
      number: '04',
      title: 'Against the Memory Hole',
      content:
        'Availability is not a measure of quality. We pledge to recommend films regardless of their streaming status. We will point you to libraries, physical media, and archives to ensure the "Dark Matter" of cinema is not forgotten.',
    },
    {
      number: '05',
      title: 'The User is not the Product',
      content:
        'We do not track your behavior to sell ads. We do not build shadow profiles. Your taste is your own. We practice "Data Minimalism" - collecting only what is strictly necessary to generate the graph.',
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
      <Header />
      <div className="mx-auto max-w-2xl py-12 px-6 antialiased">
        <JsonLd data={jsonLd} />
        <header className="mb-16">
          <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
            The Manifesto
          </h1>
          <p className="mt-8 text-lg italic leading-relaxed text-zinc-600 dark:text-zinc-400">
            We are building Discovering Cinema to be the counter-balance to the
            streaming era. These are the promises that guide our code, our
            design, and our data.
          </p>
          <div className="mt-12 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        </header>

        <main className="space-y-16">
          {tenets.map((tenet) => (
            <section key={tenet.number} className="group">
              <span className="block font-mono text-xs tracking-widest text-zinc-500 uppercase dark:text-zinc-500">
                {tenet.number}
              </span>
              <h2 className="mt-2 font-serif text-2xl text-zinc-900 dark:text-zinc-100">
                {tenet.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tenet.content}
              </p>
            </section>
          ))}

          <section className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="font-serif text-xl text-zinc-900 dark:text-zinc-100">
              What We Are Not
            </h3>
            <ul className="mt-6 space-y-3">
              {[
                'We are not a streaming service.',
                'We are not a data broker.',
                'We are not an aggregator of reviews.',
                'We are not a "content" platform.',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400"
                >
                  <span className="text-xl font-bold text-zinc-300 dark:text-zinc-700">
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
