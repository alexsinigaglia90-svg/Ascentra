export function HeroCinematic() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden border-b border-[var(--om-stroke)] px-6 pb-16 pt-28 sm:px-10 lg:px-16">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/media/operis-hero-poster.jpg"
      >
        {/* TODO: Replace with final cinematic Operis hero asset */}
        <source src="/media/operis-cinematic.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-[var(--om-bg)]/75 via-[var(--om-bg)]/45 to-[var(--om-blue)]/45" />

      <svg
        className="pointer-events-none absolute inset-0 opacity-40"
        viewBox="0 0 1200 900"
        aria-hidden="true"
      >
        <path
          d="M80 120h260M860 170h250M140 740h360M760 680h300"
          stroke="var(--om-stroke)"
          strokeWidth="2"
        />
        <circle cx="350" cy="160" r="5" fill="var(--om-brown)" />
        <circle cx="970" cy="640" r="5" fill="var(--om-blue)" />
        <path
          d="M190 250h0M190 250v110M190 360h170"
          stroke="var(--om-stroke)"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative z-10 max-w-4xl">
        <p className="mb-4 inline-flex rounded-full border border-[var(--om-stroke)] bg-white/40 px-4 py-1 text-xs uppercase tracking-[0.24em] text-[var(--om-blue)]">
          Operis by Ascentra
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-[var(--om-ink)] sm:text-6xl lg:text-7xl">
          Detachering die operatie
          <span className="block text-[var(--om-blue)]">structureel beter laat draaien.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--om-ink)]/80 sm:text-lg">
          Van vloer tot control room: Operis levert professionals die onder druk presteren,
          teams meenemen en resultaat voorspelbaar maken.
        </p>
        <a
          href="#operational-network"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--om-blue)] px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-[var(--om-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--om-blue)]"
        >
          Verken domeinen
        </a>
      </div>
    </section>
  );
}
