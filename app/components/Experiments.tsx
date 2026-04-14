export default function Experiments() {
  return (
    <section className="py-12 border-t border-zinc-200">
      <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-8">
        Active Experiments
      </span>

      <div className="grid grid-cols-1 gap-6">
        <a
          href="https://related.pictures"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:border-zinc-300 hover:bg-zinc-50"
        >
          <div className="mb-2 text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Project 01 • In development
          </div>
          <h2 className="font-serif text-2xl text-zinc-900 mb-4">
            related.pictures
          </h2>
          <p className="mb-6 text-zinc-600 leading-relaxed">
            A discovery engine based on &quot;Seven Degrees of
            Collaboration.&quot; We map the invisible threads of crew members to
            help you find films based on craft, not just cast.
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-zinc-900">
            Launch Tool
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="ml-2 h-4 w-4 stroke-current"
            >
              <path
                d="M6.75 5.75 9.25 8l-2.5 2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        <a
          href="#"
          className="group block rounded-xl border border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:border-zinc-300 hover:bg-zinc-50"
        >
          <div className="mb-2 text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Project 02 • Coming Soon
          </div>
          <h2 className="font-serif text-2xl text-zinc-900 mb-4">
            lobby.cards
          </h2>
          <p className="mb-6 text-zinc-600 leading-relaxed">
            A digital archive of lobby cards, bringing the tactile history of
            cinema promotion to the web.
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-zinc-900">
            Coming Soon
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="ml-2 h-4 w-4 stroke-current"
            >
              <path
                d="M6.75 5.75 9.25 8l-2.5 2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        <a
          href="#"
          className="group block rounded-xl border border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:border-zinc-300 hover:bg-zinc-50"
        >
          <div className="mb-2 text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Project 03 • In Development
          </div>
          <h2 className="font-serif text-2xl text-zinc-900 mb-4">
            Interactive Map
          </h2>
          <p className="mb-6 text-zinc-600 leading-relaxed">
            An interactive map to help you discover what films have been filmed
            near you and explore cinema history through geography.
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-zinc-900">
            Notify Me
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="ml-2 h-4 w-4 stroke-current"
            >
              <path
                d="M6.75 5.75 9.25 8l-2.5 2.25"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
